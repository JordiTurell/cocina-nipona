import { Request, Response } from 'express';
import { Usuario } from '../models/usuario';
import { Rol } from '../models/rols';
import { AuthService } from '../services/auth.service';

export class AuthController {
    /**
     * Registro de nuevo usuario
     */
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { password, nickname, rolId } = req.body;

            // Validar datos
            if (!password || !nickname || !rolId) {
                res.status(400).json({ 
                    error: 'Datos incompletos',
                    message: 'Se requieren password, nickname y rolId' 
                });
                return;
            }

            // Verificar si el usuario ya existe
            const existingUser = await Usuario.findOne({ where: { nickname } });
            if (existingUser) {
                res.status(409).json({ 
                    error: 'Conflicto',
                    message: 'El nickname ya está en uso' 
                });
                return;
            }

            // Verificar que el rol existe
            const rol = await Rol.findByPk(rolId);
            if (!rol) {
                res.status(404).json({ 
                    error: 'No encontrado',
                    message: 'El rol especificado no existe' 
                });
                return;
            }

            // Hashear la contraseña
            const hashedPassword = await AuthService.hashPassword(password);

            // Crear usuario
            const usuario = await Usuario.create({
                password: hashedPassword,
                nickname,
                rol: rolId,
                imageProfile: req.body.imageProfile || null
            });

            // Generar token
            const token = AuthService.generateToken({
                userId: usuario.id.toString(),
                email: usuario.nickname, // Si no tienes email, usa nickname
                nickname: usuario.nickname,
                roles: [rol.nombre] // Array con el nombre del rol
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: usuario.id,
                    nickname: usuario.nickname,
                    rol: rol.nombre
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ 
                error: 'Error del servidor',
                message: 'Error al registrar usuario' 
            });
        }
    }

    /**
     * Login de usuario
     */
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { nickname, password } = req.body;

            // Validar datos
            if (!nickname || !password) {
                res.status(400).json({ 
                    error: 'Datos incompletos',
                    message: 'Se requieren nickname y password' 
                });
                return;
            }

            // Buscar usuario
            const usuario = await Usuario.findOne({ where: { nickname } });
            if (!usuario) {
                res.status(401).json({ 
                    error: 'Credenciales inválidas',
                    message: 'Nickname o contraseña incorrectos' 
                });
                return;
            }

            // Verificar contraseña
            const isPasswordValid = await AuthService.comparePassword(
                password,
                usuario.password
            );

            if (!isPasswordValid) {
                res.status(401).json({ 
                    error: 'Credenciales inválidas',
                    message: 'Nickname o contraseña incorrectos' 
                });
                return;
            }

            // Obtener el rol
            const rol = await Rol.findByPk(usuario.rol);
            if (!rol) {
                res.status(500).json({ 
                    error: 'Error del servidor',
                    message: 'Error al obtener el rol del usuario' 
                });
                return;
            }

            // Generar token
            const token = AuthService.generateToken({
                userId: usuario.id.toString(),
                email: usuario.nickname,
                nickname: usuario.nickname,
                roles: [rol.nombre] // Puedes agregar más roles si un usuario tiene múltiples
            });

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: usuario.id,
                    nickname: usuario.nickname,
                    rol: rol.nombre,
                    imageProfile: usuario.imageProfile
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                error: 'Error del servidor',
                message: 'Error al iniciar sesión' 
            });
        }
    }

    /**
     * Obtener perfil del usuario autenticado
     */
    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            // req.user es inyectado por el middleware authMiddleware
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ 
                    error: 'No autorizado',
                    message: 'Usuario no autenticado' 
                });
                return;
            }

            const usuario = await Usuario.findByPk(userId);
            if (!usuario) {
                res.status(404).json({ 
                    error: 'No encontrado',
                    message: 'Usuario no encontrado' 
                });
                return;
            }

            const rol = await Rol.findByPk(usuario.rol);

            res.json({
                user: {
                    id: usuario.id,
                    nickname: usuario.nickname,
                    rol: rol?.nombre,
                    imageProfile: usuario.imageProfile
                }
            });
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({ 
                error: 'Error del servidor',
                message: 'Error al obtener perfil' 
            });
        }
    }
}

import { Request, Response } from "express";
import { Usuario } from "../models/usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fgjdklsfhjsk|dañ3825@471085901";

export class UsuarioService {
    async register(req: Request, res: Response): Promise<void> {
        try{
            const { email, password, nombre, rol } = req.body;

            const usuarioExistente = await Usuario.findOne({ where: { email } });

            if (usuarioExistente) {
                res.status(400).json({ message: "El usuario ya existe" });
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            
            const nuevoUsuario = await Usuario.create({
                email,
                password: hashedPassword,
                nombre,
                rol
            })

            // Generar JWT
            const token = jwt.sign(
                { id: nuevoUsuario.id, nickname: nuevoUsuario.nickname, rol: nuevoUsuario.rol },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                mensaje: 'Usuario creado exitosamente',
                token,
                usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nickname,
                rol: nuevoUsuario.rol
                }
            });
        }catch(error){
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                res.status(400).json({ error: 'Usuario no encontrado' });
            }else{
                // Verificar contraseña                
                const passwordValida = await bcrypt.compare(password, usuario.password);
                console.log(passwordValida)
                if (!passwordValida) {
                    res.status(400).json({ error: 'Contraseña incorrecta' });
                }

                // Generar JWT
                const token = jwt.sign(
                    { id: usuario.id, nickname: usuario.nickname, rol: usuario.rol },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.status(200).json({
                    status: true,
                    data:{
                        token: token,
                    }
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error en el login' });
        }
    }

    async getAllUsuarios(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await Usuario.findAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    } 
    
    async deleteUsuario(req: Request, res: Response) {
        try {
            const { id } = req.body;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            await usuario.destroy();
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    }

    async updateUsuario(req: Request, res: Response) {}

    async getUsuarioById(req: Request, res: Response) {}
}
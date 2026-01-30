import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post('/register', AuthController.register);

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post('/login', AuthController.login);

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 * Requiere: Token JWT válido
 */
router.get('/profile', authMiddleware, AuthController.getProfile);

/**
 * Ejemplo de ruta protegida solo para admins
 * GET /api/auth/admin
 */
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
    res.json({ 
        message: 'Bienvenido admin',
        user: req.user 
    });
});

export default router;

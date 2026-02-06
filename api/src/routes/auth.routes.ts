import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
    res.json({ 
        message: 'Bienvenido admin',
        user: req.user 
    });
});

export default router;

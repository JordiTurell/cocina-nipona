import { Request, Response, NextFunction } from 'express';
import { AuthService, JwtPayload } from '../services/auth.service';

// Extender el tipo Request de Express para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware que verifica si el usuario está autenticado
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (!token) {
        res.status(401).json({ 
            error: 'No autorizado',
            message: 'Token no proporcionado' 
        });
        return;
    }

    const payload = AuthService.verifyToken(token);

    if (!payload) {
        res.status(401).json({ 
            error: 'No autorizado',
            message: 'Token inválido o expirado' 
        });
        return;
    }

    // Adjuntar los datos del usuario a la request
    req.user = payload;
    next();
};

/**
 * Middleware que verifica si el usuario tiene un rol específico
 */
export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ 
                error: 'No autorizado',
                message: 'Usuario no autenticado' 
            });
            return;
        }

        if (!AuthService.hasRole(req.user, role)) {
            res.status(403).json({ 
                error: 'Prohibido',
                message: `Se requiere el rol: ${role}` 
            });
            return;
        }

        next();
    };
};

/**
 * Middleware que verifica si el usuario tiene alguno de los roles especificados
 */
export const requireAnyRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ 
                error: 'No autorizado',
                message: 'Usuario no autenticado' 
            });
            return;
        }

        if (!AuthService.hasAnyRole(req.user, roles)) {
            res.status(403).json({ 
                error: 'Prohibido',
                message: `Se requiere uno de los roles: ${roles.join(', ')}` 
            });
            return;
        }

        next();
    };
};

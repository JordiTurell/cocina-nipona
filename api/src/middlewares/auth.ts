import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fgjdk543fhjsk|dañ3825@4710ghfds85901';

export interface AuthRequest extends Request {
  usuario?: any;
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token:', token);
    console.log('JWT_SECRET:', JWT_SECRET);

    if (!token) {
        throw new Error('Token no proporcionado');
    }

    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Verified Token:', verified);
    
    req.usuario = verified;
    next();
  } catch (error) {
    console.log('Error detallado:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
}; 
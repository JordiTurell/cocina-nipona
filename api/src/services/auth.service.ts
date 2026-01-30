import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface JwtPayload {
    userId: string;
    email: string;
    nickname: string;
    roles: string[];
}

export class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
    private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
    private static readonly SALT_ROUNDS = 10;

    /**
     * Genera un token JWT con los datos del usuario
     */
    static generateToken(payload: JwtPayload): string {
        return jwt.sign(
            {
                userId: payload.userId,
                email: payload.email,
                nickname: payload.nickname,
                roles: payload.roles, // Array de roles: ["admin", "user"]
            },
            this.JWT_SECRET,
            { 
                expiresIn: this.JWT_EXPIRES_IN,
                issuer: 'cocina-nipona-api'
            }
        );
    }

    /**
     * Verifica y decodifica un token JWT
     */
    static verifyToken(token: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
            return decoded;
        } catch (error) {
            console.error('Error verificando token:', error);
            return null;
        }
    }

    /**
     * Extrae el token del header Authorization
     */
    static extractTokenFromHeader(authHeader?: string): string | null {
        if (!authHeader) return null;
        
        // Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        
        return parts[1];
    }

    /**
     * Hashea una contraseña
     */
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Compara una contraseña con su hash
     */
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Verifica si un usuario tiene un rol específico
     */
    static hasRole(payload: JwtPayload, role: string): boolean {
        return payload.roles.includes(role);
    }

    /**
     * Verifica si un usuario tiene alguno de los roles especificados
     */
    static hasAnyRole(payload: JwtPayload, roles: string[]): boolean {
        return roles.some(role => payload.roles.includes(role));
    }
}

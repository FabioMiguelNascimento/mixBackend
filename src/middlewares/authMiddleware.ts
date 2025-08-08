import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
    id: string;
    role: Role;
    companyId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET não definido nas variáveis de ambiente.");
        res.status(500).json({ error: 'Erro interno do servidor' });
        return; 
    }

    if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido' });
        return;
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
        req.userId = decoded.id;
        req.userRole = decoded.role;
        
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};
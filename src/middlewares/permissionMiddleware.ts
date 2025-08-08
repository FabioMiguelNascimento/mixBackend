import { UnauthorizedError } from '@/infrastructure/https/error/HttpErrors.js';
import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const requirePermission = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.userRole;

    if (!role) {
      return next(new UnauthorizedError('Permissão do usuário não encontrada no token.'));
    }

    if (allowedRoles.includes(role)) {
      return next();
    } else {
      return next(new UnauthorizedError('Você não tem permissão para executar esta ação.'));
    }
  };
};
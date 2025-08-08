import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../infrastructure/errors/HttpErrors.js';

export const requirePermission = (allowedPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermission = req.userPermission;

    if (!userPermission) {
      return next(new UnauthorizedError('Permissão do usuário não encontrada no token.'));
    }

    if (allowedPermissions.includes(userPermission)) {
      return next();
    } else {
      return next(new UnauthorizedError('Você não tem permissão para executar esta ação.'));
    }
  };
};
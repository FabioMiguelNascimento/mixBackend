import { Request, Response, NextFunction } from 'express';
import { HttpError } from './HttpErrors.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message
        });
        return;
    }

    console.error(err);
    res.status(500).json({
        code: 500,
        message: 'Erro interno no servidor'
    });
    return;
};

export const requestNotFound = (req: Request, res: Response) => {
    res.status(404).json({
        code: 404,
        message: 'Route not found'
    });
    return;
};
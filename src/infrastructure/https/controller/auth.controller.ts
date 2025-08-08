import UserRepository from '@/infrastructure/database/user.repository.js';
import { LoginSchemaType } from '@/schema/auth.schema.js';
import makeLoginUser from '@/use-cases/auth/login.js';
import { Request, Response, NextFunction } from 'express';

const userRepository = new UserRepository();

export const handleLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: LoginSchemaType = req.validatedData;

        const loginUserCase = makeLoginUser(userRepository);
        const user = await loginUserCase({ email, password });

        res.status(200).json({ code: 200, message: 'Login realizado com sucesso', user });
    } catch (err) {
        next(err)
    }
}
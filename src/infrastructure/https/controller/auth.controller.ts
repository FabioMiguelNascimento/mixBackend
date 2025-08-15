import UserRepository from '@/infrastructure/database/user.repository.js';
import { LoginSchemaType, RegisterSchemaType } from '@/schema/auth.schema.js';
import makeLoginUser from '@/use-cases/auth/login.js';
import makeRefreshToken from '@/use-cases/auth/refreshToken.js';
import makeRegisterUser from '@/use-cases/auth/registerUser.js';
import { Request, Response, NextFunction } from 'express';

const userRepository = new UserRepository();

export const handleLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: LoginSchemaType = req.validatedData;

        const loginUserCase = makeLoginUser(userRepository);
        const user = await loginUserCase({ email, password });

        res.status(200).json({ code: 200, message: 'Login realizado com sucesso', data: user });
    } catch (err) {
        next(err)
    }
}

export const handleRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: RegisterSchemaType = req.validatedData;

        const registerUserCase = makeRegisterUser(userRepository);
        const newUser = await registerUserCase(userData);

        if(userData.autoLogin){
            const loginUserCase = makeLoginUser(userRepository);
            const loggedInUser = await loginUserCase({ email: newUser.email, password: userData.password });
            res.status(201).json({ code: 201, message: 'Usuário registrado e logado com sucesso', data: loggedInUser });
            return
        } else {
            res.status(201).json({ code: 201, message: 'Usuário registrado com sucesso', data: newUser });
        }
    } catch (err) {
        next(err);
    }
}

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        const refreshTokenCase = makeRefreshToken(userRepository);
        const newAccessToken = await refreshTokenCase(refreshToken);

        res.status(200).json({ code: 200, message: 'Token atualizado com sucesso', data: newAccessToken });
    } catch (err) {
        next(err);
    }
}

import { CreateUserSchema } from '@/schema/user.schema.js';
import { Request, Response, NextFunction } from 'express';
import UserRepository from '@/infrastructure/database/user.repository.js';
import makeCreateUser from '@/use-cases/user/createUser.js';

const userRepository = new UserRepository();

export const handleCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { name, email, password }: CreateUserSchema = req.validatedData;

    const createUserCase = makeCreateUser(userRepository);
    await createUserCase({ name, email, password });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    next(err);
  }
};
import UsersInterface from "@/interfaces/user.interface.js";
import prisma from "@/infrastructure/database/prisma.js";
import { CreateUserSchema } from "@/schema/user.schema.js";
import { User } from "@prisma/client";
import { encodePassword } from "@/utils/bcrypt.js";

export default class UserRepository implements UsersInterface {

    async create(user: CreateUserSchema): Promise<User | void> {
        const hashedPassword = encodePassword(user.password);
        
        return prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword
            }
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }

}
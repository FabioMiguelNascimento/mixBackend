import UsersInterface from "@/interfaces/user.interface.js";
import prisma from "@/infrastructure/database/prisma.js";
import { CreateUserSchema, UserIdType } from "@/schema/user.schema.js";
import { User } from "@prisma/client";
import { encodePassword } from "@/utils/bcrypt.js";

export default class UserRepository implements UsersInterface {

    async create(user: CreateUserSchema): Promise<User | void> {
        const hashedPassword = encodePassword(user.password);
        
        return prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                phone: user.phone, // Include phone in creation
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

    async findUserByPhone(phone: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                phone: phone
            }
        });
    }

    async findAll(): Promise<User[] | void> {
        return await prisma.user.findMany({
            orderBy: [
                {
                    name: 'asc'
                },
                {
                    createdAt: 'desc'
                }
            ]
        });
    }

    async findUserById(id: UserIdType): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id: id.id
            }
        });
    }

    async delete(id: UserIdType): Promise<void> {
        await prisma.user.delete({
            where: {
                id: id.id
            }
        });
    }
}
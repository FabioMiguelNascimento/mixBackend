import prisma from "@/infrastructure/database/prisma.js";
import UsersInterface from "@/interfaces/user.interface.js";
import { CreateUserSchema } from "@/schema/user.schema.js";
import { encodePassword } from "@/utils/bcrypt.js";
import { User } from "@prisma/client";

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

    async findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id: id
            }
        });
    }

    async updateUser(id: string, user: Partial<User>): Promise<User | null> {
        return prisma.user.update({
            where: {
                id: id
            },
            data: user
        });
    }
}
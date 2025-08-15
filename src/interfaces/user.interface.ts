import { CreateUserSchema, UserIdType } from "@/schema/user.schema.js";
import { User } from "@prisma/client";

export default interface UsersInterface {
    create(user: CreateUserSchema): Promise<User | void>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByPhone(phone: string): Promise<User | null>;
    findAll(): Promise<User[] | void>;
    findUserById(id: string): Promise<User | null>;
    delete(id: string): Promise<void>;
    updateUser(id: string, user: Partial<User>): Promise<User | null>;
}
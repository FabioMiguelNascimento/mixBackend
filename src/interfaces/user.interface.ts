import { CreateUserSchema } from "@/schema/user.schema.js";
import { User } from "@prisma/client";

export default interface UsersInterface {
    create(user: CreateUserSchema): Promise<User | void>;
    findUserByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[] | void>;
}
import { createUserSchema } from "@/schema/user.schema.js";
import { User } from "@prisma/client";

export default interface UsersInterface {
    create(user: createUserSchema): Promise<User | void>;
    findUserByEmail(email: string): Promise<User | null>;
}
import UsersInterface from "@/interfaces/user.interface.js";
import { CreateUserSchema } from "@/schema/user.schema.js";
import { ConflictError } from "@/utils/errors.js";
import { User } from "@prisma/client";

export default function makeCreateUser(userInterface: UsersInterface) {
    return async function createUser(user: CreateUserSchema): Promise<User | void> {
        const existingUser = await userInterface.findUserByEmail(user.email);

        if (existingUser) {
            throw new ConflictError('Usuario ja existe com esse email');
        }

        return userInterface.create(user);
    }
}
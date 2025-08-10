import { ConflictError } from "@/infrastructure/https/error/HttpErrors.js";
import UsersInterface from "@/interfaces/user.interface.js";
import { RegisterSchemaType } from "@/schema/auth.schema.js";
import { User, Role } from "@prisma/client";

export default function makeRegisterUser(userRepository: UsersInterface) {
    return async function registerUser(userData: RegisterSchemaType): Promise<User> {

        const existingUserByEmail = await userRepository.findUserByEmail(userData.email);
        if (existingUserByEmail) {
            throw new ConflictError("Email já cadastrado.");
        }
        if (userData.phone) {
            const existingUserByPhone = await userRepository.findUserByPhone(userData.phone);
            if (existingUserByPhone) {
                throw new ConflictError("Telefone já cadastrado.");
            }
        }

        const newUser = await userRepository.create(userData);

        const { password: _password, ...userWithoutPassword } = newUser as User;

        return userWithoutPassword as User;
    }
}

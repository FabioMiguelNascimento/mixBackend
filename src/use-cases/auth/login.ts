import UserRepository from "@/infrastructure/database/user.repository.js";
import { UnauthorizedError } from "@/infrastructure/https/error/HttpErrors.js";
import { LoginSchemaType } from "@/schema/auth.schema.js";
import { LoginUserResponse } from "@/types/auth.js";
import { decodePassword } from "@/utils/bcrypt.js";
import generateToken from "@/utils/generateToken.js";

export default function makeLoginUser(userRepository: UserRepository) {
    return async function loginUser({ email, password }: LoginSchemaType): Promise<LoginUserResponse | null> {
        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Email ou senha inválidos");
        }

        if (!decodePassword(user.password, password)) {
            throw new UnauthorizedError("Email ou senha inválidos");
        }

        const { password: _, createdAt, updatedAt, ...loggedInUser } = user;

        const token = generateToken(user.id, user.role);

        return {
            ...loggedInUser,
            token,
        };
    }
}
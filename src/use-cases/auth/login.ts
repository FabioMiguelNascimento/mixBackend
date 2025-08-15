import UserRepository from "@/infrastructure/database/user.repository.js";
import { UnauthorizedError } from "@/infrastructure/https/error/HttpErrors.js";
import { LoginSchemaType } from "@/schema/auth.schema.js";
import { LoginUserResponse } from "@/types/auth.js";
import { decodePassword, encodePassword } from "@/utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "@/utils/generateToken.js";

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

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        await userRepository.updateUser(user.id, { refreshToken: encodePassword(refreshToken) });

        return {
            ...loggedInUser,
            accessToken,
            refreshToken,
        };
    }
}
import UserRepository from "@/infrastructure/database/user.repository.js";
import { UnauthorizedError } from "@/infrastructure/https/error/HttpErrors.js";
import { decodePassword } from "@/utils/bcrypt.js";
import { generateAccessToken } from "@/utils/generateToken.js";
import jwt from 'jsonwebtoken';

export default function makeRefreshToken(userRepository: UserRepository) {
    return async function refreshToken(token: string): Promise<{ accessToken: string }> {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error("JWT_REFRESH_SECRET não está definido nas variáveis de ambiente.");
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { id: string };
            const user = await userRepository.findUserById(decoded.id);

            if (!user || !user.refreshToken) {
                throw new UnauthorizedError("Refresh token inválido");
            }

            if (!decodePassword(user.refreshToken, token)) {
                throw new UnauthorizedError("Refresh token inválido");
            }

            const accessToken = generateAccessToken(user.id, user.role);

            return { accessToken };
        } catch (error) {
            throw new UnauthorizedError("Refresh token inválido");
        }
    }
}

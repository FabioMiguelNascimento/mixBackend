import UserRepository from "@/infrastructure/database/user.repository.js";
import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import { UserIdType } from "@/schema/user.schema.js";

export default function makeDeleteUser(userRepository: UserRepository) {
    return async function deleteUser(id: UserIdType) {
        const user = await userRepository.findUserById(id);

        if (!user) {
            throw new NotFoundError(`Usuário não encontrado`);
        }
    
        await userRepository.delete(id);
    
    }
}

import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import UsersInterface from "@/interfaces/user.interface.js";
import { ListAllUsersResponse } from "@/types/user/listAll.js";

export default function makeListUsers(userRepository: UsersInterface) {
  return async function listUsers(): Promise<ListAllUsersResponse[]> {
      const users = await userRepository.findAll();
      
      if (!users || users.length === 0) {
        throw new NotFoundError('Nenhum usuário encontrado');
      }

      const cleanedUsers = users.map(user => {
        const { password, ...rest } = user;
        return {
          ...rest
        };
      });

      return cleanedUsers;
    }
}
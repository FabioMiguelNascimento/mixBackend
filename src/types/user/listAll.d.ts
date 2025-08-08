import { User } from "@prisma/client";

export type ListAllUsersResponse = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
};
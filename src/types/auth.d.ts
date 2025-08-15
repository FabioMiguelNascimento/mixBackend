import { User } from "@prisma/client";

export type LoginUserResponse = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
  token: string;
  accessToken: string;
};
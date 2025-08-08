import { Role } from "@prisma/client";

declare module 'express-serve-static-core' {
  export interface Request {
    userId: string;
    userRole: Role;
    validatedData: any; // Changed to 'any' for flexibility, or a more specific type if known
  }
}
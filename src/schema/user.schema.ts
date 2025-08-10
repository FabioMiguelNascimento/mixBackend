import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    phone: z.string().optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const userIdSchema = z.object({
    id: z.string().uuid(),
});

export type UserIdType = z.infer<typeof userIdSchema>;
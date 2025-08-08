import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
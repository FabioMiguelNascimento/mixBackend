import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
  phone: z.string().optional(),
  autoLogin: z.boolean({ invalid_type_error: 'Auto login deve ser um booleano.' }).default(false).optional(),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

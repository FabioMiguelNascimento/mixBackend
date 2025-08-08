import z from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(2, 'O nome da tag deve ter pelo menos 2 caracteres.').max(50, 'O nome da tag não pode ter mais de 50 caracteres.'),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const TagId = z.object({
  id: z.string().uuid('ID inválido. Deve ser um UUID válido.'),
});
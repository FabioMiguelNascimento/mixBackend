import z from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.').max(50, 'O nome da categoria não pode ter mais de 50 caracteres.'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.').max(50, 'O nome da categoria não pode ter mais de 50 caracteres.'),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryIdSchema = z.object({
  id: z.string().uuid('ID inválido. Deve ser um UUID válido.'),
});

export type CategoryId = z.infer<typeof categoryIdSchema>;
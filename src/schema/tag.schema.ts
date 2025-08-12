import z from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(2, 'O nome da tag deve ter pelo menos 2 caracteres.').max(50, 'O nome da tag não pode ter mais de 50 caracteres.'),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = z.object({
  name: z.string().min(2, 'O nome da tag deve ter pelo menos 2 caracteres.').max(50, 'O nome da tag não pode ter mais de 50 caracteres.'),
});

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export const TagId = z.object({
  id: z.string().uuid('ID inválido. Deve ser um UUID válido.'),
});

export const listTagSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  name: z.string().optional(),
  sortBy: z.enum(['createdAt', 'name', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListTagInput = z.infer<typeof listTagSchema>;
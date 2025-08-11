import z from 'zod';

export const storageParamsSchema = z.object({
  key: z.string().min(1, 'A chave (key) é obrigatória.'),
});

export type StorageParams = z.infer<typeof storageParamsSchema>;

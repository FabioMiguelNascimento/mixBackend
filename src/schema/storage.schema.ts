import z from 'zod';

export const storageParamsSchema = z.object({
  key: z.string().min(1, 'A chave (key) é obrigatória.'),
});

export type StorageParams = z.infer<typeof storageParamsSchema>;

// Schema for batch URL generation
export const batchStorageSchema = z.object({
  keys: z.array(z.string().min(1, 'Chave não pode estar vazia')).min(1, 'É necessário pelo menos uma chave'),
});

export type BatchStorageInput = z.infer<typeof batchStorageSchema>;

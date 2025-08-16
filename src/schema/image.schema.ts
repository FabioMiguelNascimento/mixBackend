import z from 'zod';

export const imageIdSchema = z.object({
  imageId: z.string().uuid('ID da imagem inválido. Deve ser um UUID válido.'),
});

export type ImageId = z.infer<typeof imageIdSchema>;

export const imageKeysSchema = z.object({
  keys: z.array(z.string()),
});

import z from 'zod';

export const ProductTypeEnum = z.enum(['SINGLE', 'BASKET']);
export const ProductStatusEnum = z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']);

const BasketItemSchema = z.object({
  productId: z.string().uuid('ID de produto inválido'),
  quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
});

const ImageSchema = z.object({
  url: z.string().url('URL da imagem inválida'),
});

export const createProductSchema = z
  .object({
    name: z.string().min(1, 'Nome é necessário'),
    description: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().min(0, 'Preço deve ser um número positivo'),
    finalPrice: z.number().min(0, 'Preço final deve ser um número positivo'),
    stock: z.number().int().min(0, 'Estoque deve ser um inteiro não negativo'),
    type: ProductTypeEnum,
    status: ProductStatusEnum.default('DRAFT'),

    categoryIds: z.array(z.string().uuid()).min(1, 'É necessário no mínimo uma categoria'),
    tagIds: z.array(z.string().uuid()).optional(),
    images: z.array(ImageSchema).optional(),

    basketItems: z.array(BasketItemSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'BASKET') {
        return data.basketItems && data.basketItems.length > 0;
      }
      if (data.type === 'SINGLE') {
        return !data.basketItems || data.basketItems.length === 0;
      }
      return true;
    },
    {
      message: 'Cestas devem conter itens e produtos únicos não devem.',
      path: ['basketItems'],
    }
  )
  .refine((data) => data.finalPrice <= data.price, {
    message: 'O preço final não pode ser maior que o preço original.',
    path: ['finalPrice'],
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const listProductSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),

    search: z.string().optional(),
    categoryIds: z.array(z.string().uuid()).optional(),
    tagIds: z.array(z.string().uuid()).optional(),
    status: ProductStatusEnum.optional(),
    type: ProductTypeEnum.optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),

    sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListProductInput = z.infer<typeof listProductSchema>;

export const productIdSchema = z.object({
  id: z.string().uuid('ID de produto inválido'),
});

export type ProductIdInput = z.infer<typeof productIdSchema>;
import { OrderStatus } from '@prisma/client';
import z from 'zod';

export const OrderIdSchema = z.object({
  id: z.string().uuid('ID de pedido inválido.'),
});

const OrderItemSchema = z.object({
  productId: z.string().uuid('ID de produto inválido.'),
  quantity: z.number().int().min(1, 'A quantidade deve ser no mínimo 1.'),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(3, 'O nome do cliente é obrigatório.'),
  customerContact: z.string().min(10, 'O contato do cliente é obrigatório e deve ser válido.'),
  notes: z.string().max(500, 'As observações não podem exceder 500 caracteres.').optional(),
  items: z.array(OrderItemSchema).min(1, 'O pedido deve conter pelo menos um item.'),
});

export const listOrderSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),

    status: z.nativeEnum(OrderStatus).optional(),
    customerName: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

    sortBy: z.enum(['createdAt', 'totalAmount']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ListOrderInput = z.infer<typeof listOrderSchema>;

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus, { message: 'Status inválido.' }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

const UpdateOrderItemSchema = z.object({
    productId: z.string().uuid('ID de produto inválido.'),
    quantity: z.number().int().min(1, 'A quantidade deve ser no mínimo 1.'),
});

export const updateOrderSchema = z.object({
    customerName: z.string().min(3, 'O nome do cliente é obrigatório.').optional(),
    customerContact: z.string().min(10, 'O contato do cliente é obrigatório e deve ser válido.').optional(),
    notes: z.string().max(500, 'As observações não podem exceder 500 caracteres.').optional(),
    items: z.array(UpdateOrderItemSchema).min(1, 'O pedido deve conter pelo menos um item.').optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
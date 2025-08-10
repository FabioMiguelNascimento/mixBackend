import prisma from "@/infrastructure/database/prisma.js";
import IOrderRepository, { PaginatedOrdersResult } from "@/interfaces/order.interface.js";
import { CreateOrderInput, ListOrderInput, UpdateOrderInput } from "@/schema/order.schema.js";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../https/error/HttpErrors.js";
import { CreateOrderWithUserIdInput } from "@/types/order/order.js";
import { ProductIdInput } from "@/schema/product.schema.js";

export default class OrderRepository implements IOrderRepository {
    
    async create(data: CreateOrderWithUserIdInput): Promise<Order> {
        const { items, customerName, customerContact, notes, userId } = data;

        return prisma.$transaction(async (tx) => {
            const productIds = items.map((item: { productId: string }) => item.productId);
            const productsInDb = await tx.product.findMany({
                where: { id: { in: productIds } },
            });

            let totalAmount = 0;
            const orderItemsToCreate = [];

            for (const item of items) {
                const product = productsInDb.find(p => p.id === item.productId);

                if (!product) {
                    throw new NotFoundError(`Produto com ID ${item.productId} não encontrado.`);
                }

                if (product.stock < item.quantity) {
                    throw new ConflictError(`Estoque insuficiente para o produto "${product.name}". Disponível: ${product.stock}, Solicitado: ${item.quantity}.`);
                }

                totalAmount += product.finalPrice * item.quantity;
                orderItemsToCreate.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.finalPrice,
                });
            }

            const newOrder = await tx.order.create({
                data: {
                    customerName,
                    customerContact,
                    customerNotes: notes,
                    totalAmount,
                    userId,
                    orderItems: {
                        create: orderItemsToCreate,
                    },
                },
                include: {
                    orderItems: { include: { product: true } },
                },
            });

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return newOrder;
        });
    }

    async findAll(params: ListOrderInput): Promise<PaginatedOrdersResult> {
        const { page, limit, status, customerName, startDate, endDate, sortBy, sortOrder } = params;

        const where: Prisma.OrderWhereInput = {};

        if (status) {
            where.status = status;
        }

        if (customerName) {
            where.customerName = { contains: customerName, mode: 'insensitive' };
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }

        const total = await prisma.order.count({ where });

        const orders = await prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                orderItems: { include: { product: true } },
            },
        });

        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: { include: { product: true } },
            },
        });
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
        return prisma.order.update({
            where: { id },
            data: { status },
            include: {
                orderItems: { include: { product: true } },
            },
        });
    }

    async update(id: string, data: UpdateOrderInput): Promise<Order | null> {
        const { items, customerName, customerContact, notes } = data;

        return prisma.$transaction(async (tx) => {
            const existingOrder = await tx.order.findUnique({
                where: { id },
                include: {
                    orderItems: { include: { product: true } },
                },
            });

            if (!existingOrder) {
                throw new NotFoundError(`Pedido com ID ${id} não encontrado.`);
            }

            if (!items || items.length === 0) {
                return tx.order.update({
                    where: { id },
                    data: {
                        ...(customerName && { customerName }),
                        ...(customerContact && { customerContact }),
                        ...(notes !== undefined && { customerNotes: notes }),
                    },
                    include: {
                        orderItems: { include: { product: true } },
                    },
                });
            }

            // Se há itens, processar a atualização completa dos itens
            // 1. Restaurar o estoque dos itens atuais
            for (const currentItem of existingOrder.orderItems) {
                await tx.product.update({
                    where: { id: currentItem.productId },
                    data: { stock: { increment: currentItem.quantity } },
                });
            }

            // 2. Remover todos os itens atuais
            await tx.orderItem.deleteMany({
                where: { orderId: id },
            });

            // 3. Validar e preparar os novos itens
            const productIds = items.map(item => item.productId);
            const productsInDb = await tx.product.findMany({
                where: { id: { in: productIds } },
            });

            let newTotalAmount = 0;
            const orderItemsToCreate = [];

            for (const item of items) {
                const product = productsInDb.find(p => p.id === item.productId);

                if (!product) {
                    throw new NotFoundError(`Produto com ID ${item.productId} não encontrado.`);
                }

                if (product.stock < item.quantity) {
                    throw new ConflictError(`Estoque insuficiente para o produto "${product.name}". Disponível: ${product.stock}, Solicitado: ${item.quantity}.`);
                }

                // Buscar o preço histórico do produto neste pedido, ou usar o preço atual se for um novo produto
                const existingOrderItem = existingOrder.orderItems.find(oi => oi.productId === item.productId);
                const historicalPrice = existingOrderItem ? existingOrderItem.price : product.finalPrice;

                newTotalAmount += historicalPrice * item.quantity;
                orderItemsToCreate.push({
                    orderId: id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: historicalPrice,
                });
            }

            // 4. Criar os novos itens
            await tx.orderItem.createMany({
                data: orderItemsToCreate,
            });

            // 5. Decrementar o estoque dos novos itens
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // 6. Atualizar a order com os novos dados e total
            return tx.order.update({
                where: { id },
                data: {
                    ...(customerName && { customerName }),
                    ...(customerContact && { customerContact }),
                    ...(notes !== undefined && { customerNotes: notes }),
                    totalAmount: newTotalAmount,
                },
                include: {
                    orderItems: { include: { product: true } },
                },
            });
        });
    }

    async findUserOrders(userId: string, params: ListOrderInput): Promise<PaginatedOrdersResult> {
        const { page, limit, status, customerName, startDate, endDate, sortBy, sortOrder } = params;

        const where: Prisma.OrderWhereInput = {
            userId: userId,
        };

        if (status) {
            where.status = status;
        }

        if (customerName) {
            where.customerName = { contains: customerName, mode: 'insensitive' };
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }

        const total = await prisma.order.count({ where });

        const orders = await prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                orderItems: { include: { product: true } },
            },
        });

        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}

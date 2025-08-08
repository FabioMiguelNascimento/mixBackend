import prisma from "@/infrastructure/database/prisma.js";
import IOrderRepository, { PaginatedOrdersResult } from "@/interfaces/order.interface.js";
import { CreateOrderInput, ListOrderInput } from "@/schema/order.schema.js";
import { Order, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../https/error/HttpErrors.js";

export default class OrderRepository implements IOrderRepository {
    
    async create(data: CreateOrderInput): Promise<Order> {
        const { items, customerName, customerContact, notes } = data;

        return prisma.$transaction(async (tx) => {
            const productIds = items.map(item => item.productId);
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
}
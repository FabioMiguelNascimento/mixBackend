import { CreateOrderInput, ListOrderInput, UpdateOrderInput } from "@/schema/order.schema.js";
import { Order, OrderStatus } from "@prisma/client";

export type PaginatedOrdersResult = {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default interface IOrderRepository {
    create(data: CreateOrderInput): Promise<Order>;
    findAll(params: ListOrderInput): Promise<PaginatedOrdersResult>;
    findById(id: string): Promise<Order | null>;
    updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
    update(id: string, data: UpdateOrderInput): Promise<Order | null>;
}
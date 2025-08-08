import { Order } from "@prisma/client";
import { CreateOrderInput, ListOrderInput } from "@/schema/order.schema.js";

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
}
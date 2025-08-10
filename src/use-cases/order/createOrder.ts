import IOrderRepository from "@/interfaces/order.interface.js";
import { CreateOrderInput } from "@/schema/order.schema.js";
import { CreateOrderWithUserIdInput } from "@/types/order/order.js";
import { Order } from "@prisma/client";

export default function makeCreateOrder(repository: IOrderRepository) {
    return async function createOrder(data: CreateOrderWithUserIdInput): Promise<Order> {
        return repository.create(data);
    }
}
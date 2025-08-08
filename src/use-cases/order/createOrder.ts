import IOrderRepository from "@/interfaces/order.interface.js";
import { CreateOrderInput } from "@/schema/order.schema.js";
import { Order } from "@prisma/client";

export default function makeCreateOrder(repository: IOrderRepository) {
    return async function createOrder(data: CreateOrderInput): Promise<Order> {
        return repository.create(data);
    }
}

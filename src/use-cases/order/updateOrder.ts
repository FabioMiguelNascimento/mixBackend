import IOrderRepository from "@/interfaces/order.interface.js";
import { Order } from "@prisma/client";
import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import { UpdateOrderInput } from "@/schema/order.schema.js";

export default function makeUpdateOrder(repository: IOrderRepository) {
    return async function updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
        const updatedOrder = await repository.update(id, data);

        if (!updatedOrder) {
            throw new NotFoundError(`Pedido com ID ${id} não encontrado.`);
        }

        return updatedOrder;
    }
}

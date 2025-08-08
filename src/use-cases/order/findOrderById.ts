import IOrderRepository from "@/interfaces/order.interface.js";
import { Order } from "@prisma/client";
import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";

export default function makeFindOrderById(repository: IOrderRepository) {
    return async function findOrderById(id: string): Promise<Order> {
        const order = await repository.findById(id);

        if (!order) {
            throw new NotFoundError(`Pedido com ID ${id} não encontrado.`);
        }

        return order;
    }
}

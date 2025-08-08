import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import IOrderRepository from "@/interfaces/order.interface.js";
import { OrderStatus, Order } from "@prisma/client";

export default function makeUpdateOrderStatus(repository: IOrderRepository) {
    return async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        const order = await repository.findById(id);

        if (!order) {
            throw new NotFoundError(`Pedido com ID ${id} não encontrado.`);
        }

        const updatedOrder = await repository.updateStatus(id, status);

        if (!updatedOrder) {
            throw new Error("Falha ao atualizar o status do pedido.");
        }

        return updatedOrder;
    }
}

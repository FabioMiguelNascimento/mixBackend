import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import IOrderRepository, { PaginatedOrdersResult } from "@/interfaces/order.interface.js";
import { ListOrderInput } from "@/schema/order.schema.js";

export default function makeFindAllOrders(repository: IOrderRepository) {
    return async function findAllOrders(params: ListOrderInput): Promise<PaginatedOrdersResult> {
        const orders = await repository.findAll(params);

        if (!orders || orders.orders.length === 0) {
            throw new NotFoundError('Nenhum pedido encontrado com os critérios fornecidos.');
        }

        return orders;
    }
}

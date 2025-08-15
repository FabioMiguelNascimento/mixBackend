import IOrderRepository, { PaginatedOrdersResult } from "@/interfaces/order.interface.js";
import { ListOrderInput } from "@/schema/order.schema.js";

export default function makeFindAllOrders(repository: IOrderRepository) {
    return async function findAllOrders(params: ListOrderInput): Promise<PaginatedOrdersResult> {
        const orders = await repository.findAll(params);

        return orders;
    }
}

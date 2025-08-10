import IOrderRepository, { PaginatedOrdersResult } from "@/interfaces/order.interface.js";
import { ListOrderInput } from "@/schema/order.schema.js";

export default function makeFindMyOrders(repository: IOrderRepository) {
    return async function findMyOrders(userId: string, params: ListOrderInput): Promise<PaginatedOrdersResult> {
        return repository.findUserOrders(userId, params);
    }
}

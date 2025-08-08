import IProductRepository, { PaginatedProductsResult } from "@/interfaces/product.interface.js";
import { ListProductInput } from "@/schema/product.schema.js";

export default function makeFindAllProducts(repository: IProductRepository) {
    return async function findAllProducts(params: ListProductInput): Promise<PaginatedProductsResult> {
        return repository.findAll(params);
    }
}

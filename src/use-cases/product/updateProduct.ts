import IProductRepository from "@/interfaces/product.interface.js";
import { Product } from "@prisma/client";
import { UpdateProductInput } from "@/schema/product.schema.js";
import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";

export default function makeUpdateProduct(repository: IProductRepository) {
    return async function updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
        const updatedProduct = await repository.update(id, data);

        if (!updatedProduct) {
            throw new NotFoundError(`Produto com ID ${id} não encontrado.`);
        }

        return updatedProduct;
    }
}

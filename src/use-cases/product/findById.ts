import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import IProductRepository from "@/interfaces/product.interface.js";
import { Product } from "@prisma/client";

export default function makeFindProduct(repository: IProductRepository) {
    return async function findProduct(id: string): Promise<Product | null> {

        const product = await repository.findById(id);

        if (!product) {
            throw new NotFoundError("Produto nao encontrado");
        }

        return product;
    }
}

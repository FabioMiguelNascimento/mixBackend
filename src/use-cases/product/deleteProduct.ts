import IProductRepository from "@/interfaces/product.interface.js";
import { NotFoundError, ConflictError } from "@/infrastructure/https/error/HttpErrors.js";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

export default function makeDeleteProduct(repository: IProductRepository) {
    return async function deleteProduct(id: string): Promise<void> {
        const existingProduct = await repository.findById(id);

        if (!existingProduct) {
            throw new NotFoundError(`Produto com ID ${id} não encontrado.`);
        }

        try {
            await repository.delete(id);
        } catch (error) {
            if (error.code === 'P2003') {
                throw new ConflictError(`Não é possível excluir o produto com ID ${id} porque ele está associado a um ou mais pedidos existentes. Considere arquivá-lo em vez de excluí-lo.`);
            }
            throw error;
        }
    }
}
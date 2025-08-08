import ICategoryRepository from "@/interfaces/category.interface.js";
import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";

export default function makeDeleteCategory(repository: ICategoryRepository) {
    return async function deleteCategory(id: string): Promise<void> {
        const existingCategory = await repository.findById(id);

        if (!existingCategory) {
            throw new NotFoundError(`Categoria com ID ${id} não encontrada.`);
        }

        await repository.delete(id);
    }
}
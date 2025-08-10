import ICategoryRepository from "@/interfaces/category.interface.js";
import { Category } from "@prisma/client";
import { UpdateCategoryInput } from "@/schema/category.schema.js";
import { ConflictError, NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";

export default function makeUpdateCategory(repository: ICategoryRepository) {
    return async function updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
        const existingCategory = await repository.findById(id);

        if (!existingCategory) {
            throw new NotFoundError(`Categoria com ID ${id} não encontrada.`);
        }

        const categoryWithSameName = await repository.findByName(data.name);
        if (categoryWithSameName && categoryWithSameName.id !== id) {
            throw new ConflictError(`Uma categoria com o nome "${data.name}" já existe.`);
        }

        const updatedCategory = await repository.update(id, data);

        return updatedCategory as Category;
    }
}

import ICategoryRepository from "@/interfaces/category.interface.js";
import { Category } from "@prisma/client";
import { HttpErrors } from "@/infrastructure/https/error/HttpErrors.js";
import { UpdateCategoryInput } from "@/schema/category.schema.js";

export default function makeUpdateCategory(repository: ICategoryRepository) {
    return async function updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
        const existingCategory = await repository.findById(id);

        if (!existingCategory) {
            throw new HttpErrors.NotFound(`Categoria com ID ${id} não encontrada.`);
        }

        const categoryWithSameName = await repository.findByName(data.name);
        if (categoryWithSameName && categoryWithSameName.id !== id) {
            throw new HttpErrors.Conflict(`Uma categoria com o nome "${data.name}" já existe.`);
        }

        const updatedCategory = await repository.update(id, data);

        if (!updatedCategory) {
            throw new HttpErrors.InternalServerError("Falha ao atualizar a categoria.");
        }

        return updatedCategory;
    }
}

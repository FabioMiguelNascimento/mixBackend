import { ConflictError} from "@/infrastructure/https/error/HttpErrors.js";
import ICategoryRepository from "@/interfaces/category.interface.js";
import { CreateCategoryInput } from "@/schema/category.schema.js";
import { Category } from "@prisma/client";

export default function makeCreateCategory(repository: ICategoryRepository) {
    return async function createCategory(data: CreateCategoryInput): Promise<Category> {
        const existingCategory = await repository.findByName(data.name);

        if (existingCategory) {
            throw new ConflictError("Uma categoria com este nome já existe.");
        }

        return repository.create(data);
    }
}

import ICategoryRepository from "@/interfaces/category.interface.js";
import { ListCategoryInput } from "@/schema/category.schema.js";
import { Category } from "@prisma/client";

export default function makeFindAllCategories(repository: ICategoryRepository) {
    return async function findAllCategories(query: ListCategoryInput): Promise<{ categories: Category[], total: number }> {
        return repository.findAll(query);
    }
}

import ICategoryRepository from "@/interfaces/category.interface.js";
import { Category } from "@prisma/client";

export default function makeFindAllCategories(repository: ICategoryRepository) {
    return async function findAllCategories(): Promise<Category[]> {
        return repository.findAll();
    }
}

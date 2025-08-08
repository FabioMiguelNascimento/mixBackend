import { Category } from "@prisma/client";
import { CreateCategoryInput } from "@/schema/category.schema.js";

export default interface ICategoryRepository {
    create(data: CreateCategoryInput): Promise<Category>;
    findAll(): Promise<Category[]>;
    findByName(name: string): Promise<Category | null>;
}

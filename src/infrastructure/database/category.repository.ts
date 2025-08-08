import prisma from "@/infrastructure/database/prisma.js";
import ICategoryRepository from "@/interfaces/category.interface.js";
import { CreateCategoryInput } from "@/schema/category.schema.js";
import { Category } from "@prisma/client";

export default class CategoryRepository implements ICategoryRepository {
    
    async create(data: CreateCategoryInput): Promise<Category> {
        return prisma.category.create({ data });
    }

    async findAll(): Promise<Category[]> {
        return prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    }

    async findByName(name: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { name },
        });
    }
}

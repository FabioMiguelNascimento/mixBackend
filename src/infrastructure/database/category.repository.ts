import prisma from "@/infrastructure/database/prisma.js";
import ICategoryRepository from "@/interfaces/category.interface.js";
import { CreateCategoryInput, UpdateCategoryInput } from "@/schema/category.schema.js";
import { Category } from "@prisma/client";

export default class CategoryRepository implements ICategoryRepository {
    
    async create(data: CreateCategoryInput): Promise<Category> {
        return prisma.category.create({ data });
    }

    async findAll(query: { name?: string, page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc' }): Promise<{ categories: Category[], total: number }> {
        const { name, page, limit, sortBy, sortOrder } = query;

        const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};

        const categories = await prisma.category.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        });

        const total = await prisma.category.count({ where });

        return { categories, total };
    }

    async findByName(name: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { name },
        });
    }

    async findById(id: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.category.delete({
            where: { id },
        });
    }

    async update(id: string, data: UpdateCategoryInput): Promise<Category | null> {
        return prisma.category.update({
            where: { id },
            data: { name: data.name },
        });
    }
}

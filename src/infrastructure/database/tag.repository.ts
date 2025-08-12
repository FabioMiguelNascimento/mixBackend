import prisma from "@/infrastructure/database/prisma.js";
import ITagRepository from "@/interfaces/tag.interface.js";
import { CreateTagInput, UpdateTagInput } from "@/schema/tag.schema.js";
import { Tag } from "@prisma/client";

export default class TagRepository implements ITagRepository {
    
    async create(data: CreateTagInput): Promise<Tag> {
        return prisma.tag.create({ data });
    }

    async findAll(query: { name?: string, page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc' }): Promise<{ tags: Tag[], total: number }> {
        const { name, page, limit, sortBy, sortOrder } = query;

        const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};

        const tags = await prisma.tag.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        });

        const total = await prisma.tag.count({ where });

        return { tags, total };
    }

    async findByName(name: string): Promise<Tag | null> {
        return prisma.tag.findUnique({
            where: { name },
        });
    }

    async findById(id: string): Promise<Tag | null> {
        return prisma.tag.findUnique({
            where: { id },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.tag.delete({
            where: { id },
        });
    }

    async update(id: string, data: UpdateTagInput): Promise<Tag | null> {
        return prisma.tag.update({
            where: { id },
            data: { name: data.name },
        });
    }
}
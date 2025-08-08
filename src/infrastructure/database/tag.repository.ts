import prisma from "@/infrastructure/database/prisma.js";
import ITagRepository from "@/interfaces/tag.interface.js";
import { CreateTagInput } from "@/schema/tag.schema.js";
import { Tag } from "@prisma/client";

export default class TagRepository implements ITagRepository {
    
    async create(data: CreateTagInput): Promise<Tag> {
        return prisma.tag.create({ data });
    }

    async findAll(): Promise<Tag[]> {
        return prisma.tag.findMany({
            orderBy: { name: 'asc' }
        });
    }

    async findByName(name: string): Promise<Tag | null> {
        return prisma.tag.findUnique({
            where: { name },
        });
    }
}

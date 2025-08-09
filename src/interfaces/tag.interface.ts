import { Tag } from "@prisma/client";
import { CreateTagInput, UpdateTagInput } from "@/schema/tag.schema.js";

export default interface ITagRepository {
    create(data: CreateTagInput): Promise<Tag>;
    findAll(): Promise<Tag[]>;
    findByName(name: string): Promise<Tag | null>;
    findById(id: string): Promise<Tag | null>;
    delete(id: string): Promise<void>;
    update(id: string, data: UpdateTagInput): Promise<Tag | null>;
}
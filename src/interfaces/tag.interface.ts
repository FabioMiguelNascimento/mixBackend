import { Tag } from "@prisma/client";
import { CreateTagInput } from "@/schema/tag.schema.js";

export default interface ITagRepository {
    create(data: CreateTagInput): Promise<Tag>;
    findAll(): Promise<Tag[]>;
    findByName(name: string): Promise<Tag | null>;
}

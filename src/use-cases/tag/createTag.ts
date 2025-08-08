import { ConflictError } from "@/infrastructure/https/error/HttpErrors.js";
import ITagRepository from "@/interfaces/tag.interface.js";
import { CreateTagInput } from "@/schema/tag.schema.js";
import { Tag } from "@prisma/client";

export default function makeCreateTag(repository: ITagRepository) {
    return async function createTag(data: CreateTagInput): Promise<Tag> {
        const existingTag = await repository.findByName(data.name);

        if (existingTag) {
            throw new ConflictError("Uma tag com este nome já existe.");
        }

        return repository.create(data);
    }
}

import ITagRepository from "@/interfaces/tag.interface.js";
import { ListTagInput } from "@/schema/tag.schema.js";
import { Tag } from "@prisma/client";

export default function makeFindAllTags(repository: ITagRepository) {
    return async function findAllTags(query: ListTagInput): Promise<{ tags: Tag[], total: number }> {
        return repository.findAll(query);
    }
}

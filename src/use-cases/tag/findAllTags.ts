import ITagRepository from "@/interfaces/tag.interface.js";
import { Tag } from "@prisma/client";

export default function makeFindAllTags(repository: ITagRepository) {
    return async function findAllTags(): Promise<Tag[]> {
        return repository.findAll();
    }
}

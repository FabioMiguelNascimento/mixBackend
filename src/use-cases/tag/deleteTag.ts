import ITagRepository from "@/interfaces/tag.interface.js";
import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";

export default function makeDeleteTag(repository: ITagRepository) {
    return async function deleteTag(id: string): Promise<void> {
        const existingTag = await repository.findById(id);

        if (!existingTag) {
            throw new NotFoundError(`Tag com ID ${id} não encontrada.`);
        }

        await repository.delete(id);
    }
}
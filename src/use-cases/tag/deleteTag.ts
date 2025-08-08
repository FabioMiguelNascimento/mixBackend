import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import ITagRepository from "@/interfaces/tag.interface.js";

export default function makeDeleteTag(repository: ITagRepository) {
    return async function deleteTag(id: string): Promise<void> {

        const tag = await repository.findById(id);
        if (!tag) {
            throw new NotFoundError(`Tag com ID ${id} não encontrada.`);
        }

        await repository.delete(id);
    }
}
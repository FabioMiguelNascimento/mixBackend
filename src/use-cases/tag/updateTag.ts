import ITagRepository from "@/interfaces/tag.interface.js";
import { Tag } from "@prisma/client";
import { HttpErrors } from "@/infrastructure/https/error/HttpErrors.js";
import { UpdateTagInput } from "@/schema/tag.schema.js";

export default function makeUpdateTag(repository: ITagRepository) {
    return async function updateTag(id: string, data: UpdateTagInput): Promise<Tag> {
        const existingTag = await repository.findById(id);

        if (!existingTag) {
            throw new HttpErrors.NotFound(`Tag com ID ${id} não encontrada.`);
        }

        const tagWithSameName = await repository.findByName(data.name);
        if (tagWithSameName && tagWithSameName.id !== id) {
            throw new HttpErrors.Conflict(`Uma tag com o nome "${data.name}" já existe.`);
        }

        const updatedTag = await repository.update(id, data);

        if (!updatedTag) {
            throw new HttpErrors.InternalServerError("Falha ao atualizar a tag.");
        }

        return updatedTag;
    }
}

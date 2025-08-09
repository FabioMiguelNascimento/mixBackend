import { Request, Response, NextFunction } from 'express';
import TagRepository from '@/infrastructure/database/tag.repository.js';
import makeCreateTag from '@/use-cases/tag/createTag.js';
import makeFindAllTags from '@/use-cases/tag/findAllTags.js';
import makeDeleteTag from '@/use-cases/tag/deleteTag.js';
import makeUpdateTag from '@/use-cases/tag/updateTag.js';

const tagRepository = new TagRepository();

export async function handleCreateTag(req: Request, res: Response, next: NextFunction) {
    try {
        const createTag = makeCreateTag(tagRepository);
        const tag = await createTag(req.body);
        res.status(201).json(tag);
    } catch (error) {
        next(error);
    }
}

export async function handleFindAllTags(req: Request, res: Response, next: NextFunction) {
    try {
        const findAllTags = makeFindAllTags(tagRepository);
        const tags = await findAllTags();
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
}

export async function handleDeleteTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.validatedData;

        const deleteTagCase = makeDeleteTag(tagRepository);
        await deleteTagCase(id);
        
        res.status(204).send({ code: 204, message: "Tag deletada com sucesso" });
    } catch (error) {
        next(error);
    }
}

export async function handleUpdateTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const data = req.validatedData;

        const updateTag = makeUpdateTag(tagRepository);
        const updatedTag = await updateTag(id, data);

        res.status(200).json({ code: 200, message: 'Tag atualizada com sucesso', data: updatedTag });
    } catch (error) {
        next(error);
    }
}
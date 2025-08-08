import { Request, Response, NextFunction } from 'express';
import TagRepository from '@/infrastructure/database/tag.repository.js';
import makeCreateTag from '@/use-cases/tag/createTag.js';
import makeFindAllTags from '@/use-cases/tag/findAllTags.js';

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

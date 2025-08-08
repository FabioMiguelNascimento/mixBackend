import { Request, Response, NextFunction } from 'express';
import CategoryRepository from '@/infrastructure/database/category.repository.js';
import makeCreateCategory from '@/use-cases/category/createCategory.js';
import makeFindAllCategories from '@/use-cases/category/findAllCategories.js';

const categoryRepository = new CategoryRepository();

export async function handleCreateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const createCategory = makeCreateCategory(categoryRepository);
        const category = await createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

export async function handleFindAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const findAllCategories = makeFindAllCategories(categoryRepository);
        const categories = await findAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

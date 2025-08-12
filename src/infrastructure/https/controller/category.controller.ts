import { Request, Response, NextFunction } from 'express';
import CategoryRepository from '@/infrastructure/database/category.repository.js';
import makeCreateCategory from '@/use-cases/category/createCategory.js';
import makeFindAllCategories from '@/use-cases/category/findAllCategories.js';
import makeDeleteCategory from '@/use-cases/category/deleteCategory.js';
import makeUpdateCategory from '@/use-cases/category/updateCategory.js';

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
        const { page, limit, sortBy, sortOrder, name } = req.validatedData;

        const findAllCategories = makeFindAllCategories(categoryRepository);
        const categories = await findAllCategories({ page, limit, sortBy, sortOrder, name });
        res.status(200).json({ code: 200, message: 'Categorias encontradas com sucesso.', data: categories });
    } catch (error) {
        next(error);
    }
}

export async function handleDeleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const deleteCategory = makeDeleteCategory(categoryRepository);
        await deleteCategory(id);

        res.status(204).send({ code: 204, message: 'Categoria deletada com sucesso.' });
    } catch (error) {
        next(error);
    }
}

export async function handleUpdateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const data = req.validatedData;

        const updateCategory = makeUpdateCategory(categoryRepository);
        const updatedCategory = await updateCategory(id, data);

        res.status(200).json({ code: 200, message: 'Categoria atualizada com sucesso', data: updatedCategory });
    } catch (error) {
        next(error);
    }
}
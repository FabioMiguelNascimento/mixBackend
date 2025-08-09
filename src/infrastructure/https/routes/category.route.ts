import express from 'express';
import { validateBody, validateParams } from '@/middlewares/validateRequestMiddleware.js';
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from '@/schema/category.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleCreateCategory, handleDeleteCategory, handleFindAllCategories, handleUpdateCategory } from '../controller/category.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requirePermission(['ADMIN', 'MANAGER', 'SELLER']))

router.post('/', validateBody(createCategorySchema), handleCreateCategory);
router.get('/', handleFindAllCategories);
router.delete('/:id', validateParams(categoryIdSchema), handleDeleteCategory);
router.patch('/:id', validateParams(categoryIdSchema), validateBody(updateCategorySchema), handleUpdateCategory);

export default router;
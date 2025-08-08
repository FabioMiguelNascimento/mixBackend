import express from 'express';
import { validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { createCategorySchema } from '@/schema/category.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleCreateCategory, handleFindAllCategories } from '../controller/category.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requirePermission(['ADMIN', 'MANAGER', 'SELLER']))

router.post('/', validateBody(createCategorySchema), handleCreateCategory);
router.get('/', handleFindAllCategories);

export default router;

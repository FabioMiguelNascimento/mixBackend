import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { createProductSchema, listProductSchema } from '@/schema/product.schema.js';
import express from 'express';
import { handleCreateProduct } from '../controller/product.controller.js';

const router = express.Router();

// router.post('/list', validateBody(listProductSchema), handleListProducts)
router.post('/', authMiddleware, requirePermission(['ADMIN', 'MANAGER', 'SELLER']), validateBody(createProductSchema), handleCreateProduct);

export default router;
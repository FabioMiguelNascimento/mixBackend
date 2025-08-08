import express from 'express';
import { createProductSchema, listProductSchema, productIdSchema } from '@/schema/product.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleFindAllProducts, handleCreateProduct, handleFindProduct } from '../controller/product.controller.js';
import { validateBody, validateParams } from '@/middlewares/validateRequestMiddleware.js';

const router = express.Router();

router.post('/list',validateBody(listProductSchema),handleFindAllProducts);
router.get('/:id', validateParams(productIdSchema), handleFindProduct);

router.use(authMiddleware, requirePermission(['ADMIN', 'MANAGER', 'SELLER']));

router.post('/',validateBody(createProductSchema),handleCreateProduct);

export default router;
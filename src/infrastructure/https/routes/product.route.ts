import express from 'express';
import { createProductSchema, listProductSchema, productIdSchema, updateProductSchema } from '@/schema/product.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleFindAllProducts, handleCreateProduct, handleFindProduct, handleUpdateProduct } from '../controller/product.controller.js';
import { validateBody, validateParams } from '@/middlewares/validateRequestMiddleware.js';

const router = express.Router();

router.post('/list',validateBody(listProductSchema),handleFindAllProducts);
router.get('/:id', validateParams(productIdSchema), handleFindProduct);

router.use(authMiddleware, requirePermission(['ADMIN', 'MANAGER', 'SELLER']));

router.post('/',validateBody(createProductSchema),handleCreateProduct);

router.patch( '/:id', validateParams(productIdSchema), validateBody(updateProductSchema), handleUpdateProduct);

export default router;
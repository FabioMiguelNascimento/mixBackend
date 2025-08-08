import express from 'express';
import { validateRequest } from '@/middlewares/validateRequestMiddleware.js';
import { handleCreateOrder, handleFindAllOrders } from '../controller/order.controller.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { createOrderSchema, listOrderSchema } from '@/schema/order.schema.js';

const router = express.Router();

router.post('/', validateRequest(createOrderSchema), handleCreateOrder);

router.use(authMiddleware, requirePermission(['ADMIN', 'MANAGER', 'SELLER']))

router.post('/list', validateRequest(listOrderSchema), handleFindAllOrders);

export default router;

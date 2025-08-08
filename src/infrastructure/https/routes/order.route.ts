import express from 'express';
import { validateBody, validateParams } from '@/middlewares/validateRequestMiddleware.js';
import { handleCreateOrder, handleFindAllOrders, handleFindOrderById } from '../controller/order.controller.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { createOrderSchema, listOrderSchema, OrderIdSchema } from '@/schema/order.schema.js';

const router = express.Router();

router.post('/', validateBody(createOrderSchema), handleCreateOrder);

router.use(authMiddleware, requirePermission(['ADMIN', 'MANAGER', 'SELLER']))

router.post('/list', validateBody(listOrderSchema), handleFindAllOrders);

router.get('/:id', validateParams(OrderIdSchema), handleFindOrderById);

export default router;
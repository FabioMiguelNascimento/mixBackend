import { validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { createUserSchema } from '@/schema/user.schema.js';
import express from 'express';
import { handleCreateUser } from '../controller/user.controller.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, requirePermission(['ADMIN', 'MANAGER']), validateBody(createUserSchema), handleCreateUser)

export default router;
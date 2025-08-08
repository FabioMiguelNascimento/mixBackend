import { validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { createUserSchema } from '@/schema/user.schema.js';
import express from 'express';
import { handleCreateUser, handleListUsers } from '../controller/user.controller.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Create user
router.post('/', requirePermission(['ADMIN', 'MANAGER']), validateBody(createUserSchema), handleCreateUser)

// List all users
router.get('/', requirePermission(['ADMIN', 'MANAGER']), handleListUsers)


export default router;
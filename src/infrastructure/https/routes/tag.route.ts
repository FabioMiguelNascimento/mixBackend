import express from 'express';
import { validateRequest } from '@/middlewares/validateRequestMiddleware.js';
import { createTagSchema } from '@/schema/tag.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleCreateTag, handleFindAllTags } from '../controller/tag.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requirePermission(['ADMIN', 'MANAGER', 'SELLER']));

router.post('/', validateRequest(createTagSchema), handleCreateTag);
router.get('/', handleFindAllTags);

export default router;

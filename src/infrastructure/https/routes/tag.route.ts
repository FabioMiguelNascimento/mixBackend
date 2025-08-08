import express from 'express';
import { validateParams, validateRequest } from '@/middlewares/validateRequestMiddleware.js';
import { createTagSchema, TagId as TagIdSchema } from '@/schema/tag.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleCreateTag, handleDeleteTag, handleFindAllTags } from '../controller/tag.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requirePermission(['ADMIN', 'MANAGER', 'SELLER']));

router.post('/', validateRequest(createTagSchema), handleCreateTag);
router.get('/', handleFindAllTags);
router.delete('/:id', validateParams(TagIdSchema), handleDeleteTag);

export default router;

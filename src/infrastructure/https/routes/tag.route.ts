import express from 'express';
import { validateParams, validateRequest, validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { createTagSchema, TagId as TagIdSchema, updateTagSchema, listTagSchema } from '@/schema/tag.schema.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';
import { requirePermission } from '@/middlewares/permissionMiddleware.js';
import { handleCreateTag, handleDeleteTag, handleFindAllTags, handleUpdateTag } from '../controller/tag.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requirePermission(['ADMIN', 'MANAGER', 'SELLER']));

router.post('/', validateRequest(createTagSchema), handleCreateTag);
router.post('/list', validateBody(listTagSchema), handleFindAllTags);
router.delete('/:id', validateParams(TagIdSchema), handleDeleteTag);
router.patch('/:id', validateParams(TagIdSchema), validateBody(updateTagSchema), handleUpdateTag);
export default router;

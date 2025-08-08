import { validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { createUserSchema } from '@/schema/user.schema.js';
import express from 'express';
import { handleCreateUser } from '../controller/user.controller.js';

const router = express.Router();

router.post('/', validateBody(createUserSchema), handleCreateUser)

export default router;
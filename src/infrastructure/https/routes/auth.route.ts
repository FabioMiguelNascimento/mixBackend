import { validateBody } from '@/middlewares/validateRequestMiddleware.js';
import { loginSchema } from '@/schema/auth.schema.js';
import express from 'express';
import { handleLoginUser } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/login', validateBody(loginSchema), handleLoginUser);

export default router;
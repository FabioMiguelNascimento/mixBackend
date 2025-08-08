import { rateLimit} from 'express-rate-limit';

export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Muitas requisições, tente novamente mais tarde.',
})

export const messageLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Muitas requisições, tente novamente mais tarde.',
})
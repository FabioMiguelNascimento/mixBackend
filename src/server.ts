import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { errorHandler, requestNotFound } from './infrastructure/https/error/ErrorHandler.js';
import pingRoute from './infrastructure/https/routes/ping.route.js';
import userRoute from './infrastructure/https/routes/user.route.js';
import authRoute from './infrastructure/https/routes/auth.route.js';
import productRoute from './infrastructure/https/routes/product.route.js';
import categoryRoute from './infrastructure/https/routes/category.route.js';
import tagRoute from './infrastructure/https/routes/tag.route.js';
import orderRoute from './infrastructure/https/routes/order.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());


app.use('/api/ping', pingRoute);
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/tag', tagRoute);
app.use('/api/order', orderRoute);

app.use(errorHandler);
app.use(requestNotFound);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


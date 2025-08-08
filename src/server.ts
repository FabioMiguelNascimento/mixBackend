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

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());


app.use('/api/ping', pingRoute);
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.use(errorHandler);
app.use(requestNotFound);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


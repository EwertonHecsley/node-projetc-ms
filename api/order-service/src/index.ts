import express from 'express';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './domain/order/error/errorHandler';
const app = express();

app.use(express.json());

app.use("/order", orderRoutes);

app.use(errorHandler);

export default app;
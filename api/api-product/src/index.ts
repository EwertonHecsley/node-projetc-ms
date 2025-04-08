import express from 'express';
import productRoutes from './routes/product.route';
import { errorHandler } from './domain/Product/errors/errorHandler';

const app = express();

app.use(express.json());

app.use("/product", productRoutes);

app.use(errorHandler);

export default app;
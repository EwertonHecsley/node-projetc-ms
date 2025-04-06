import { Router } from 'express';
import { ProductController } from '../http/controllers/Product.controller';


const productRoutes = Router();
const controller = new ProductController();

productRoutes.post("/", (req, res) => controller.create(req, res));

export default productRoutes;
import { Router } from 'express';

import { schemaProduct } from '../domain/product/schema/schema.product';
import { updateProductSchema } from '../domain/product/schema/schema.updateProducts';
import { wrapController } from '../domain/utils/assyncController';
import { ProductController } from '../infra/http/controllers/Product.controller';
import { validate } from '../infra/http/middlewares/validate';


const productRoutes = Router();
const controller = wrapController(new ProductController());

productRoutes.post("/", validate(schemaProduct), controller.create);
productRoutes.get("/", controller.list);
productRoutes.get("/:id", controller.find);
productRoutes.delete("/:id", controller.destroy);
productRoutes.put("/:id", validate(updateProductSchema), controller.update);

export default productRoutes;
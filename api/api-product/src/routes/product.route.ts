import { Router } from 'express';
import { ProductController } from '../http/controllers/Product.controller';
import { wrapController } from '../domain/utils/assyncController';
import { validate } from '../http/middlewares/validate';
import { schemaProduct } from '../domain/Product/schema/schema.product';
import { updateProductSchema } from '../domain/Product/schema/schema.updateProducts';


const productRoutes = Router();
const controller = wrapController(new ProductController());

productRoutes.post("/", validate(schemaProduct), controller.create);
productRoutes.get("/", controller.list);
productRoutes.get("/:id", controller.find);
productRoutes.delete("/:id", controller.destroy);
productRoutes.patch("/:id", validate(updateProductSchema), controller.update);

export default productRoutes;
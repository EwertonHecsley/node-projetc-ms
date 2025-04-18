import { Router } from 'express';
import { wrapController } from '../utils/assyncController';
import { OderController } from '../infra/http/controllers/Order.controller';
import { validate } from '../infra/http/middlewares/validate';
import { createOrderSchema } from '../domain/order/schema/createOrder';

const orderRoutes = Router();
const controller = wrapController(new OderController());

orderRoutes.post('/', validate(createOrderSchema), controller.create);

export default orderRoutes;
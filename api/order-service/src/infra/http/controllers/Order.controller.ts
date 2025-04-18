import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../../domain/order/useCase/Create";
import { OrderPrismaRepository } from "../../database/repository/Order.repository";
import logger from "../../../utils/logger";
import { GenericErrors } from "../../../domain/order/error/GenericError";
import { OrderPresenter } from "../presenters/Order.presenter";

export class OderController {
    private readonly repository = new OrderPrismaRepository();
    private readonly createOrderService = new CreateOrderUseCase(this.repository);

    async create(req: Request, res: Response): Promise<void> {

        logger.info('📦 Criando novo pedido...');
        const result = await this.createOrderService.execute(req.body);

        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            logger.warn(`❌ Falha ao criar pedido: ${result.value?.message}`);
            res.status(error.statusCode).json({ message: error.message });
            return;
        }

        logger.info('✅ Pedido criado com sucesso.');
        res.status(201).json(
            {
                message: 'Pedido criado com sucesso.',
                order: OrderPresenter.toHTTP(result.value.order),
            }
        );
    }
}
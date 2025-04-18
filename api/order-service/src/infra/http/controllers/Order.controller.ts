import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../../domain/order/useCase/Create";
import { OrderPrismaRepository } from "../../database/repository/Order.repository";
import logger from "../../../utils/logger";
import { GenericErrors } from "../../../domain/order/error/GenericError";
import { OrderPresenter } from "../presenters/Order.presenter";
import { ListOrderUseCase } from "../../../domain/order/useCase/List";
import { FindOrderUseCase } from "../../../domain/order/useCase/Find";

export class OderController {
    private readonly repository = new OrderPrismaRepository();
    private readonly createOrderService = new CreateOrderUseCase(this.repository);
    private readonly listAllOrderService = new ListOrderUseCase(this.repository);
    private readonly findByIdOrder = new FindOrderUseCase(this.repository);

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

    async listAll(req: Request, res: Response): Promise<void> {

        logger.info('📦 Listando todos os pedidos...');
        const result = await this.listAllOrderService.execute();

        logger.info('✅ Pedidos listados com sucesso.');
        res.status(200).json(
            {
                message: 'Pedidos listados com sucesso.',
                orders: result.value!.map(OrderPresenter.toHTTP),
            }
        );
    }

    async findById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        logger.info(`📦 Buscando pedido com ID ${id}...`);
        const result = await this.findByIdOrder.execute({ id });

        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            logger.warn(`❌ Falha ao buscar pedido: ${result.value?.message}`);
            res.status(error.statusCode).json({ message: error.message });
            return;
        }

        logger.info('✅ Pedido encontrado com sucesso.');
        res.status(200).json(
            {
                message: 'Pedido encontrado com sucesso.',
                order: OrderPresenter.toHTTP(result.value!),
            }
        );
    }
}
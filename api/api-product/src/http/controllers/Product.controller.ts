import { Request, Response } from "express";
import { ProductPresenter } from "../presenters/Product.presenters";
import { ProductPrismaRepository } from "../../infra/database/repositories/Product.repository";
import { CreateProductUseCase } from "../../domain/Product/useCase/create";
import { GenericErrors } from "../../domain/Product/errors/GenericError";
import logger from "../../domain/utils/logger";

export class ProductController {
    private readonly repository = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repository);

    async create(req: Request, res: Response): Promise<void> {

        logger.info('📦 Creating new product...');
        const { name, price, description } = req.body;

        const result = await this.createUseCase.execute({ name, price, description });

        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            logger.warn(`❌ Product creation failed: ${result.value?.message}`);
            res.status(error.statusCode).json({ message: error.message });
            return;
        }

        logger.info('✅ Product created successfully');
        res.status(201).json({
            message: 'Product created successfully.',
            product: ProductPresenter.toHTTP(result.value),
        });
    }
}

import { Request, Response } from "express";
import { ProductPresenter } from "../presenters/Product.presenters";
import { ProductPrismaRepository } from "../../infra/database/repositories/Product.repository";
import { CreateProductUseCase } from "../../domain/Product/useCase/create";
import { GenericErrors } from "../../domain/Product/errors/GenericError";
import logger from "../../domain/utils/logger";
import { ListProductsUseCase } from "../../domain/Product/useCase/list";

export class ProductController {
    private readonly repository = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repository);
    private readonly listUseCase = new ListProductsUseCase(this.repository);

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
        res.status(201).json(
            {
                message: 'Product created successfully.',
                product: ProductPresenter.toHTTP(result.value),
            }
        );
    }

    async list(req_: Request, res: Response): Promise<void> {
        logger.info('📦 Listing products...');
        const products = await this.listUseCase.execute();

        logger.info('✅ Product listed successfully');
        res.status(200).json(
            {
                message: 'Products list ok',
                products: products.value?.map(ProductPresenter.toHTTP)
            }
        )
    }
}

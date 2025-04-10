import { Request, Response } from "express";
import { ProductPresenter } from "../presenters/Product.presenters";
import { ProductPrismaRepository } from "../../infra/database/repositories/Product.repository";
import { CreateProductUseCase } from "../../domain/Product/useCase/create";
import { GenericErrors } from "../../domain/Product/errors/GenericError";
import logger from "../../domain/utils/logger";
import { ListProductsUseCase } from "../../domain/Product/useCase/list";
import { FindPruductUseCase } from "../../domain/Product/useCase/find";
import { IdParamSchema } from "../../domain/Product/schema/schema.paramsID";
import { DestroyProductUseCase } from "../../domain/Product/useCase/destroy";

export class ProductController {
    private readonly repository = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repository);
    private readonly listUseCase = new ListProductsUseCase(this.repository);
    private readonly findUsecCase = new FindPruductUseCase(this.repository);
    private readonly destroyUseCase = new DestroyProductUseCase(this.repository);

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

        logger.info('✅ Product created successfully.');
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

    async find(req: Request, res: Response): Promise<void> {

        const { error, value } = IdParamSchema.validate(req.params, { abortEarly: false });

        if (error) {
            logger.warn(`❌ Invalid ID format: ${error.message}`);
            res.status(400).json({
                message: 'Validation failed.',
                errors: error.details.map((d) => d.message),
            });
            return;
        }

        const { id } = value;

        logger.info('📦 Searching product by ID...');
        const result = await this.findUsecCase.execute({ id });

        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            logger.warn(`❌ Searching product failed: ${error.message}`);
            res.status(error.statusCode).json({ message: error.message });
            return;
        }

        logger.info('✅ Product found successfully.');
        res.status(200).json({
            message: 'Product retrieved successfully.',
            product: ProductPresenter.toHTTP(result.value),
        });
    }

    async destroy(req: Request, res: Response): Promise<void> {
        const { error, value } = IdParamSchema.validate(req.params, { abortEarly: false });

        if (error) {
            logger.warn(`❌ Invalid ID format: ${error.message}`);
            res.status(400).json({
                message: 'Validation failed.',
                content: {
                    errors: error.details.map((d) => d.message),
                },
            });
            return;
        }

        const { id } = value;

        logger.info('🗑️ Deleting product...');
        const result = await this.destroyUseCase.execute({ id });

        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            logger.warn(`❌ Delete failed: ${error.message}`);
            res.status(error.statusCode).json({
                message: 'Product deletion failed.',
                content: {
                    error: error.message,
                },
            });
            return;
        }

        logger.info('✅ Product deleted successfully.');
        res.sendStatus(204);
    }
}

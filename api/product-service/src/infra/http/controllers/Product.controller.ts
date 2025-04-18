import { Request, Response } from "express";
import { ProductPresenter } from "../presenters/Product.presenters";
import { ProductPrismaRepository } from "../../database/repositories/Product.repository";
import { CreateProductUseCase } from "../../../domain/product/useCase/Create";
import { ListProductsUseCase } from "../../../domain/product/useCase/List";
import { FindPruductUseCase } from "../../../domain/product/useCase/Find";
import { DestroyProductUseCase } from "../../../domain/product/useCase/Destroy";
import { EditProductUseCase } from "../../../domain/product/useCase/Edit";
import logger from "../../../domain/utils/logger";
import { GenericErrors } from "../../../domain/product/errors/GenericError";
import { IdParamSchema } from "../../../domain/product/schema/schema.paramsID";


export class ProductController {
    private readonly repository = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repository);
    private readonly listUseCase = new ListProductsUseCase(this.repository);
    private readonly findUsecCase = new FindPruductUseCase(this.repository);
    private readonly destroyUseCase = new DestroyProductUseCase(this.repository);
    private readonly editUseCase = new EditProductUseCase(this.repository);

    async create(req: Request, res: Response): Promise<void> {

        logger.info('📦 Creating new product...');
        const { name, price, description, quantity } = req.body;

        const result = await this.createUseCase.execute({ name, price, description, quantity });

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

    async update(req: Request, res: Response) {
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

        logger.info('🔄 Updating product...');
        const result = await this.editUseCase.execute({ id, ...req.body });


        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            logger.warn(`❌ Updated failed: ${error.message}`);
            res.status(error.statusCode).json({
                message: 'Product updated failed.',
                content: {
                    error: error.message,
                },
            });
            return;
        }

        logger.info('✅ Product updated successfully.');
        res.sendStatus(204);
    }
}

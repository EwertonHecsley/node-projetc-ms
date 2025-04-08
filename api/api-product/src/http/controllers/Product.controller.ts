// Product.controller.ts
import { Request, Response } from "express";

import { ProductPresenter } from "../presenters/Product.presenters";
import { ProductPrismaRepository } from "../../infra/database/repositories/Product.repository";
import { CreateProductUseCase } from "../../domain/Product/useCase/create";
import { GenericErrors } from "../../domain/Product/errors/GenericError";

export class ProductController {
    private readonly repository = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repository);

    async create(req: Request, res: Response): Promise<void> {
        const { name, price, description } = req.body;

        const result = await this.createUseCase.execute({ name, price, description });

        if (result.isLeft()) {
            const error = result.value as GenericErrors;
            res.status(error.statusCode).json({ message: error.message });
            return;
        }

        res.status(201).json({
            message: 'Product created successfully.',
            product: ProductPresenter.toHTTP(result.value),
        });
    }
}

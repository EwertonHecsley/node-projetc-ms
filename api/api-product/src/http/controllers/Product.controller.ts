// Product.controller.ts
import { Request, Response } from "express";

import { ProductPresenter } from "../presenters/Product.presenters";
import { ProductPrismaRepository } from "../../infra/database/repositories/Product.repository";
import { CreateProductUseCase } from "../../domain/Product/useCase/create";

export class ProductController {
    private readonly repository = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repository);

    async create(req: Request, res: Response): Promise<void> {
        const { name, price, description } = req.body;

        const result = await this.createUseCase.execute({ name, price, description });

        if (result.isLeft()) {
            res.status(500).json({ message: 'Erro interno, produto não cadastrado' });
            return;
        }

        res.status(201).json({
            message: 'Produto cadastrado com sucesso!',
            product: ProductPresenter.toHTTP(result.value),
        });
    }
}

import { Request, Response } from "express";
import { ProductPrismaRepository } from "../infra/database/repositories/Product.repository";
import { CreateProductUseCase } from "../domain/Product/useCase/create";
import { EditProductUseCase } from "../domain/Product/useCase/Edit";

export class ProductController {

    private readonly repositoy = new ProductPrismaRepository();
    private readonly createUseCase = new CreateProductUseCase(this.repositoy);
    private readonly editUseCase = new EditProductUseCase(this.repositoy);

    async create(req: Request, res: Response): Promise<Response> {
        const { name, price, description } = req.body;

        const result = await this.createUseCase.execute({ name, price, description });

        if (result.isLeft()) {
            return res.status(500).json({ message: 'Erro interno, produto nao cadastrado' });
        }

        return res.status(201).json({ message: 'Produto cadastrado com sucesso!', product: result.value })
    }
}
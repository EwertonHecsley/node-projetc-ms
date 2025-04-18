import { Either, left, right } from "../../utils/Either.response";
import { NotFoundError } from "../errors/custom/NotFound.error";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    productId: string;
    quantitySold: number;
}

type Response = Either<NotFoundError, boolean>;

export class UpdateProductStockUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute({ productId, quantitySold }: Request): Promise<Response> {
        const product = await this.productRepository.findMany(productId);

        if (!product) {
            return left(new NotFoundError('Produto não encontrado.'));
        }

        if (product.quantity < quantitySold) {
            return left(new NotFoundError('Estoque insuficiente.'));
        }

        product.quantity -= quantitySold;

        await this.productRepository.save(product);

        return right(true);
    }
}
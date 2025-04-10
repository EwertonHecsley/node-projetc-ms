import { Either, left, right } from "../../utils/Either.response";
import { NotFoundError } from "../errors/custom/NotFound.error";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    id: string;
    name?: string;
    price?: number;
    description?: string;
}

type Response = Either<NotFoundError, boolean>;

export class EditProductUseCase {

    constructor(private readonly productRepository: ProductRepository) { }

    async execute(data: Request): Promise<Response> {
        const { ...dataL } = data

        const product = await this.productRepository.findMany(dataL.id);

        if (!product) {
            return left(new NotFoundError('Product not found with this ID'));
        }

        if (dataL.name) product.name = dataL.name
        if (dataL.price) product.price = dataL.price;
        if (dataL.description!) product.description = dataL.description

        await this.productRepository.save(product);

        return right(true);
    }
}
import { Either, left, right } from "../../utils/Either.response";
import Product from "../entity/Product.entity";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    name: string;
    price: number;
    description?: string;
}

type Response = Either<null, Product>

export class CreateProductUseCase {

    constructor(private readonly poductRepository: ProductRepository) { }

    async execute(data: Request): Promise<Response> {
        const product = Product.create(data);

        if (!product) {
            return left(null);
        }

        await this.poductRepository.create(product);

        return right(product);
    }
}
import { Either, right } from "../../utils/Either.response";
import Product from "../entity/Product.entity";
import { ProductRepository } from "../repository/Product.repository";

type Response = Either<null, Product[]>;

export class ListProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(): Promise<Response> {
        const products = await this.productRepository.find();

        return right(products);
    }
}
import { Either, left, right } from "../../utils/Either.response";
import Product from "../entity/Product.entity";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    id: string;
}

type Response = Either<null, Product>;

export class FindPruductUseCase {

    constructor(private readonly productRepository: ProductRepository) { }

    async execute({ id }: Request): Promise<Response> {
        const product = await this.productRepository.findMany(id);

        if (!product) return left(null);

        return right(product);
    }
}
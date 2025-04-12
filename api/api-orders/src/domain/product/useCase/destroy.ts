import { Either, left, right } from "../../utils/Either.response";
import { NotFoundError } from "../errors/custom/NotFound.error";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    id: string;
}

type Response = Either<NotFoundError, boolean>;

export class DestroyProductUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute({ id }: Request): Promise<Response> {
        const product = await this.productRepository.findMany(id);

        if (!product) {
            return left(new NotFoundError());
        }

        await this.productRepository.destroy(id);

        return right(true);
    }
}
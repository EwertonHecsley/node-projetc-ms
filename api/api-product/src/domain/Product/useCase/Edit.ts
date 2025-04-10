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
        console.log(dataL)
        const product = await this.productRepository.findMany(data.id);

        if (!product) {
            return left(new NotFoundError('Product not found with this ID'));
        }

        if (data.name != undefined) product.name = data.name
        if (data.price != undefined) product.price = data.price;
        if (data.description != undefined) product.description = data.description

        await this.productRepository.save(product);

        return right(true);
    }
}
import { Either, left, right } from "../../utils/Either.response";
import { NotFoundError } from "../errors/custom/NotFound.error";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    id: string;
    name?: string;
    price?: number;
    description?: string;
    quantity?: number;
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

        Object.entries(dataL).forEach(([key, value]) => {
            if (key !== 'id' && typeof value !== 'undefined' && key in product) {
                (product as any)[key] = value;
            }
        });


        await this.productRepository.save(product);

        return right(true);
    }
}
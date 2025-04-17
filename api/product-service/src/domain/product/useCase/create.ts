import { Either, left, right } from "../../utils/Either.response";
import Product from "../entity/Product.entity";
import { BadRequest } from "../errors/custom/BadRequest";
import { ProductRepository } from "../repository/Product.repository";

type Request = {
    name: string;
    price: number;
    quantity: number;
    description?: string;
}

type Response = Either<null | BadRequest, Product>

export class CreateProductUseCase {

    constructor(private readonly poductRepository: ProductRepository) { }

    async execute(data: Request): Promise<Response> {

        const { name } = data;

        const nameExist = await this.poductRepository.findName(name);

        if (nameExist) return left(new BadRequest("Product with this name already exists"))

        const product = Product.create(data);

        if (!product) {
            return left(null);
        }

        await this.poductRepository.create(product);

        return right(product);
    }
}
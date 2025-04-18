import { Either, left, right } from "../../../utils/either";
import { Order } from "../entity/Order.entity";
import { NotFound } from "../error/custom/NotFoundError";
import { OrderRepository } from "../repository/Order.repository";

type Request = {
    id: string;
}

type Response = Either<NotFound, Order>;

export class FindOrderUseCase {

    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(data: Request): Promise<Response> {
        const { id } = data;

        const order = await this.orderRepository.find(id);

        if (!order) {
            return left(new NotFound());
        }

        return right(order);
    }
}
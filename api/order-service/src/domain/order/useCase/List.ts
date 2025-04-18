import { Either, right } from "../../../utils/either";
import { Order } from "../entity/Order.entity";
import { OrderRepository } from "../repository/Order.repository";

type Response = Either<null, Order[]>

export class ListOrderUseCase {

    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(): Promise<Response> {
        const orders = await this.orderRepository.list();

        return right(orders);
    }
}
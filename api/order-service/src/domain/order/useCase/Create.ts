import { ProductCacheService } from "../../../infra/cache/Redis.service";
import { Either, left, right } from "../../../utils/either";
import { Order } from "../entity/Order.entity";
import { OrderDate } from "../object-value/OrderDate";
import { OrderRepository } from "../repository/Order.repository";
import { NotFound } from "../error/custom/NotFoundError";
import { BadRequest } from "../error/custom/BadRequestError";
import { StatusOrder } from "../enums/StatusOrder";
import { Producer } from "../../../infra/messaging/rabbitmq/Producer";


type Request = {
    products: {
        id: string;
        quantity: number;
    }[];
};

type Response = Either<NotFound | BadRequest, { order: Order; }>;

export class CreateOrderUseCase {

    constructor(private readonly orderReposiroy: OrderRepository) { }

    async execute(request: Request): Promise<Response> {
        const fetchedProducts = [];

        for (const item of request.products) {
            const product = await ProductCacheService.getProductById(item.id);

            if (!product) {
                return left(new NotFound(`Produto com ID ${item.id} não encontrado.`));
            }

            if (item.quantity > product.quantity) {
                return left(new BadRequest(`Quantidade indisponível para o produto ${product.name}.`));
            }

            fetchedProducts.push({
                ...product,
                quantity: item.quantity,
            });
        }

        const totalPrice = fetchedProducts.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );

        const order = Order.create({
            products: fetchedProducts,
            totalPrice,
            orderDate: OrderDate.now(),
            status: StatusOrder.PENDING
        });

        await this.orderReposiroy.create(order);

        Producer.sendMessage(`Novo pedido criado: ${order.id}`);

        return right({ order });
    }
}

import { ProductCacheService } from "../../../infra/cache/Redis.service";
import { Either, left, right } from "../../../utils/either";
import { Order } from "../entity/Order.entity";
import { OrderDate } from "../object-value/OrderDate";
import { OrderRepository } from "../repository/Order.repository";
import { NotFound } from "../error/custom/NotFoundError";
import { BadRequest } from "../error/custom/BadRequestError";
import { StatusOrder } from "../enums/StatusOrder";
import { Producer } from "../../../infra/messaging/rabbitmq/Producer";
import { PaymentConsumer } from "../../../infra/messaging/rabbitmq/PayamentConsumer";
import logger from "../../../utils/logger";

type Request = {
    products: {
        id: string;
        quantity: number;
    }[];
};

type Response = Either<NotFound | BadRequest, { order: Order }>;

export class CreateOrderUseCase {
    constructor(
        private readonly orderRepository: OrderRepository
    ) { }

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
            status: StatusOrder.PENDING,
        });

        const paymentMessage = {
            type: 'payment.request',
            orderId: order.id.valueId,
            totalPrice,
            products: fetchedProducts,
        };

        Producer.sendMessage(paymentMessage);
        logger.info(`Solicitação de pagamento enviada para o pedido ${order.id.valueId}`);

        try {
            const paymentResponse = await PaymentConsumer.consumePaymentResponse(order.id.valueId);

            if (paymentResponse === 'pago') {
                order.status = StatusOrder.PAID;
                await this.orderRepository.create(order);

                for (const product of fetchedProducts) {
                    Producer.sendMessage({
                        type: 'product.stock.updated',
                        productId: product.id,
                        quantitySold: product.quantity,
                    });
                }
                logger.info(`Solicitação de atualização de estoque enviada para o pedido ${order.id.valueId}`);

                return right({ order });
            } else {
                return left(new BadRequest("Pagamento não realizado. Pedido cancelado."));
            }
        } catch (error) {
            logger.error("Erro ao aguardar resposta de pagamento:", error);
            return left(new BadRequest("Erro ao processar pagamento. Pedido cancelado."));
        }
    }
}
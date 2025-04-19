import amqp from 'amqplib';
import logger from '../../infra/logger/logger';
import { ProcessPayment } from '../../application/useCase/ProcessPayment';

const processPaymentUseCase = new ProcessPayment();

export async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();
        const exchangeName = 'order.events';
        const queueName = 'payment.requests.queue';

        await channel.assertExchange(exchangeName, 'fanout', { durable: true });
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName, '');

        console.log(`Aguardando mensagens na fila "${queueName}"...`);

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    const { orderId, products } = content;

                    if (!orderId || !products || products.length === 0) {
                        logger.error('Pedido inválido recebido:', content);
                        channel.nack(msg);
                        return;
                    }

                    logger.info(`Recebida solicitação de pagamento para o pedido ${orderId}`);
                    const paymentResult = await processPaymentUseCase.execute(products, orderId);

                    const responseMessage = {
                        type: 'payment.processed',
                        orderId: paymentResult.orderId,
                        status: paymentResult.status,
                        products: paymentResult.products,
                    };


                    await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(responseMessage)));
                    logger.info(`Resposta de pagamento enviada para o pedido ${orderId}: ${paymentResult.status}`);
                    channel.ack(msg);

                } catch (error) {
                    logger.error('Erro ao processar solicitação de pagamento:', error);
                    channel.nack(msg);
                }
            }
        });

    } catch (error) {
        logger.error('Erro ao iniciar consumidor de pagamento:', error);
    }
}
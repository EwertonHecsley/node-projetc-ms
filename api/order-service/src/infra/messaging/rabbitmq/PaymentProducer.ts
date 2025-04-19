// src/infra/messaging/rabbitmq/PaymentProducer.ts
import amqp from 'amqplib/callback_api';
import logger from "../../../utils/logger";

export class PaymentProducer {
    private static connectionUrl = 'amqp://guest:guest@localhost:5672';
    private static exchange = 'payment.exchange';
    private static responseQueue = 'payment.response.queue';

    public static sendMessage(paymentMessage: any): void {
        amqp.connect(this.connectionUrl, (error, connection) => {
            if (error) {
                logger.error('Erro ao conectar no RabbitMQ (PaymentProducer):', error);
                throw error;
            }

            connection.createChannel((error, channel) => {
                if (error) {
                    logger.error('Erro ao criar canal (PaymentProducer):', error);
                    throw error;
                }

                channel.assertExchange(this.exchange, 'direct', { durable: true });
                channel.assertQueue(this.responseQueue, { durable: true });


                const payload = JSON.stringify(paymentMessage);
                channel.publish(this.exchange, '', Buffer.from(payload));

                logger.info(`📨 Mensagem de pagamento enviada: ${JSON.stringify(paymentMessage)}`);

                setTimeout(() => {
                    connection.close();
                }, 500);
            });
        });
    }
}

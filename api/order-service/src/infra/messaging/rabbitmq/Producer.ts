import amqp from 'amqplib/callback_api';
import logger from '../../../utils/logger';

export class Producer {
    private static connectionUrl = 'amqp://guest:guest@localhost:5672';
    private static exchangeName = 'order.events';

    public static sendMessage(message: any): void {
        amqp.connect(this.connectionUrl, (error, connection) => {
            if (error) {
                logger.error('Erro ao conectar no RabbitMQ (Producer):', error);
                throw error;
            }

            connection.createChannel((error, channel) => {
                if (error) {
                    logger.error('Erro ao criar canal (Producer):', error);
                    throw error;
                }

                channel.assertExchange(Producer.exchangeName, 'fanout', { durable: true });

                const payload = JSON.stringify(message);
                channel.publish(Producer.exchangeName, '', Buffer.from(payload));

                logger.info(`📨 Mensagem enviada para exchange ${Producer.exchangeName}: ${payload}`);

                setTimeout(() => {
                    connection.close();
                }, 500);
            });
        });
    }
}
import amqp from 'amqplib/callback_api';
import logger from '../logger/logger';


export class Producer {
    private static connectionUrl = 'amqp://guest:guest@localhost:5672';
    private static exchange = 'order.exchange';

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


                channel.assertExchange(this.exchange, 'fanout', { durable: true });

                // Envia a mensagem para a exchange
                const payload = JSON.stringify(message);
                channel.publish(this.exchange, '', Buffer.from(payload));

                logger.info(`📨 Mensagem enviada para exchange ${this.exchange}: ${payload}`);

                setTimeout(() => {
                    connection.close();
                }, 500);
            });
        });
    }
}

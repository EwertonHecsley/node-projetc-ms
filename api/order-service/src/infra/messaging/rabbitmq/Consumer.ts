import amqp from 'amqplib/callback_api';
import logger from '../../../utils/logger';

export class Consumer {
    private static connectionUrl = 'amqp://localhost';
    private static exchange = 'order.exchange';


    public static consumeMessages(): void {
        amqp.connect(this.connectionUrl, (error, connection) => {
            if (error) {
                logger.error('Erro ao conectar no RabbitMQ (Consumer):', error);
                throw error;
            }

            connection.createChannel((error, channel) => {
                if (error) {
                    logger.error('Erro ao criar canal (Consumer):', error);
                    throw error;
                }

                channel.assertExchange(this.exchange, 'fanout', { durable: true });


                channel.assertQueue('', { exclusive: true }, (error2, q) => {
                    if (error2) {
                        logger.error('Erro ao criar fila (Consumer):', error2);
                        throw error2;
                    }


                    channel.bindQueue(q.queue, this.exchange, '');


                    channel.consume(q.queue, (msg) => {
                        if (msg) {
                            const message = msg.content.toString();
                            logger.info(`Mensagem recebida na fila ${q.queue}: ${message}`);
                        }
                    });
                });
            });
        });
    }
}

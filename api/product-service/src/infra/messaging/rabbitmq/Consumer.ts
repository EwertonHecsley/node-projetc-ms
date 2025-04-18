import amqp from 'amqplib/callback_api';
import logger from '../../../domain/utils/logger';
import { UpdateProductStockUseCase } from '../../../domain/product/useCase/UpdateProductStockUseCase';
import { ProductPrismaRepository } from '../../database/repositories/Product.repository';

export class Consumer {
    private static connectionUrl = 'amqp://guest:guest@localhost:5672';
    private static exchange = 'order.exchange';

    public static consumeMessages(): void {
        const updateProductStockUseCase = new UpdateProductStockUseCase(new ProductPrismaRepository());

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

                    channel.consume(q.queue, async (msg) => {
                        if (msg) {
                            try {
                                const raw = msg.content.toString();
                                const data = JSON.parse(raw);
                                logger.info(`📩 Mensagem recebida na fila ${q.queue}: ${raw}`);

                                const result = await updateProductStockUseCase.execute({
                                    productId: data.productId,
                                    quantitySold: data.quantitySold,
                                });

                                if (result.isLeft()) {
                                    logger.error('❌ Erro ao atualizar estoque:', result.value.message);
                                } else {
                                    logger.info('✅ Estoque atualizado com sucesso');
                                }

                            } catch (err) {
                                logger.error('❌ Erro ao processar mensagem:', err);
                            }
                        }
                    }, { noAck: true });
                });
            });
        });
    }
}
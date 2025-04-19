import amqp from 'amqplib/callback_api';
import logger from '../../../domain/utils/logger';
import { UpdateProductStockUseCase } from '../../../domain/product/useCase/UpdateProductStockUseCase';
import { ProductPrismaRepository } from '../../database/repositories/Product.repository';

export class Consumer {
    private static connectionUrl = 'amqp://guest:guest@localhost:5672';
    private static exchangeName = 'order.events';
    private static queueName = 'product.stock.updates.queue';

    public static consumeMessages(): void {
        const updateProductStockUseCase = new UpdateProductStockUseCase(new ProductPrismaRepository());

        amqp.connect(this.connectionUrl, (error, connection) => {
            if (error) {
                logger.error('Erro ao conectar no RabbitMQ (Consumer de Estoque):', error);
                throw error;
            }

            connection.createChannel((error, channel) => {
                if (error) {
                    logger.error('Erro ao criar canal (Consumer de Estoque):', error);
                    throw error;
                }

                channel.assertExchange(Consumer.exchangeName, 'fanout', { durable: true });
                channel.assertQueue(Consumer.queueName, { durable: true });
                channel.bindQueue(Consumer.queueName, Consumer.exchangeName, '');

                channel.consume(Consumer.queueName, async (msg) => {
                    if (msg) {
                        try {
                            const raw = msg.content.toString();
                            const data = JSON.parse(raw);


                            if (data.type === 'product.stock.updated') {
                                logger.info(`📩 Mensagem de atualização de estoque recebida na fila ${Consumer.queueName}: ${raw}`);

                                const result = await updateProductStockUseCase.execute({
                                    productId: data.productId,
                                    quantitySold: data.quantitySold,
                                });

                                if (result.isLeft()) {
                                    logger.error('❌ Erro ao atualizar estoque:', result.value.message);
                                } else {
                                    logger.info('✅ Estoque atualizado com sucesso');
                                }
                                channel.ack(msg);
                            } else {

                                channel.ack(msg);
                            }
                        } catch (err) {
                            logger.error('❌ Erro ao processar mensagem de atualização de estoque:', err);
                            channel.nack(msg);
                        }
                    }
                }, { noAck: false });
            });
        });
    }
}
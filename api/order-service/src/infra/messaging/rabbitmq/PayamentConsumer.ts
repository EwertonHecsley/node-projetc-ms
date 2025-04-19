import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';
import logger from "../../../utils/logger";

const connectionUrl = 'amqp://guest:guest@localhost:5672';
const exchangeName = 'order.events';
const responseQueueName = 'order.payment.responses.queue';
const responsePromises = new Map<string, (status: string) => void>();

let connection: Connection | null = null;
let channel: Channel | null = null;

async function connectRabbitMQ(): Promise<Channel> {
    if (channel) {
        return channel;
    }
    try {
        connection = await amqp.connect(connectionUrl);
        channel = await connection.createChannel();
        return channel;
    } catch (err: any) {
        logger.error('Erro ao conectar ou criar canal no RabbitMQ (PaymentConsumer):', err);
        throw err;
    }
}

async function startPaymentResponseConsumer() {
    try {
        const ch = await connectRabbitMQ();

        await ch.assertExchange(exchangeName, 'fanout', { durable: true });
        await ch.assertQueue(responseQueueName, { durable: true });
        await ch.bindQueue(responseQueueName, exchangeName, '');

        ch.consume(responseQueueName, (msg: ConsumeMessage | null) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content!.toString());
                    if (content.type === 'payment.processed' && content.orderId) {
                        logger.info(`📩 Resposta de pagamento recebida para o pedido ${content.orderId}: ${JSON.stringify(content)}`);
                        const resolvePromise = responsePromises.get(content.orderId);
                        if (resolvePromise) {
                            resolvePromise(content.status);
                            responsePromises.delete(content.orderId);
                        }
                        ch.ack(msg);
                    } else {
                        ch.ack(msg);
                    }
                } catch (err: any) {
                    logger.error('Erro ao processar mensagem de resposta de pagamento:', err);
                    ch.nack(msg);
                }
            }
        }, { noAck: false });

        logger.info('🟢 Consumidor de respostas de pagamento iniciado.');

        connection?.on('close', () => {
            console.log('Conexão com RabbitMQ fechada. Tentando reconectar...');
            setTimeout(startPaymentResponseConsumer, 5000);
        });

    } catch (error: any) {
        logger.error('Erro ao iniciar consumidor de respostas de pagamento:', error);
    }
}

export class PaymentConsumer {
    static initialize() {
        startPaymentResponseConsumer();
    }

    static consumePaymentResponse(orderId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            responsePromises.set(orderId, resolve);
            setTimeout(() => {
                responsePromises.delete(orderId);
                reject(new Error("Timeout ao receber resposta de pagamento"));
            }, 10000);
        });
    }
}
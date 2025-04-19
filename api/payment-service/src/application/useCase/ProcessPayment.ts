import logger from "../../infra/logger/logger";

export class ProcessPayment {
    async execute(products: any[], orderId: string): Promise<any> {
        if (!orderId || !products || products.length === 0) {
            logger.error('Erro: Pedido inválido. Não foi possível processar.');
            throw new Error('Pedido inválido');
        }

        const status = Math.random() > 0.5 ? 'pago' : 'cancelado';


        logger.info(`💳 Pagamento processado para pedido ${orderId}: ${status}`);

        return {
            orderId,
            status,
            products,
        };
    }
}

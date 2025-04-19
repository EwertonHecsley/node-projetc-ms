import express from 'express';
import { ProcessPayment } from './application/useCase/ProcessPayment';
import logger from "./infra/logger/logger";
import { startConsumer } from "./infra/messaging/PayamentConsumerService";

const app = express();
app.use(express.json());

const processPayment = new ProcessPayment();

app.post('/process-payment', async (req, res) => {
    const { orderId, products } = req.body;

    if (!orderId || !products || products.length === 0) {
        return res.status(400).json({ error: 'Pedido inválido' });
    }

    try {
        const payment = await processPayment.execute(products, orderId);
        return res.json(payment);
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
});

app.get('/', (_, res) => {
    res.send('API de Pagamento em execução');
});

const PORT = 3003;

app.listen(PORT, () => {
    logger.info(`🟢 API de Pagamento rodando na porta ${PORT}`);
    startConsumer();
});

export default app; 
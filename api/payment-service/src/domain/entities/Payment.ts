export type PaymentStatus = 'pago' | 'cancelado';

export class Payment {
    constructor(
        public readonly productId: string,
        public readonly status: PaymentStatus
    ) { }

    static simulate(productId: string): Payment {
        const status = Math.random() > 0.5 ? 'pago' : 'cancelado';
        return new Payment(productId, status);
    }

    static simulateMultiple(products: { id: string }[]): Payment[] {
        return products.map(product => this.simulate(product.id));
    }
}

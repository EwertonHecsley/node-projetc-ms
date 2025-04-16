export class OrderDate {
    private readonly value: Date;

    private constructor(date: Date) {
        this.value = date;
    }

    static now(): OrderDate {
        return new OrderDate(new Date());
    }

    get raw(): Date {
        return this.value;
    }

    toISO(): string {
        return this.value.toISOString();
    }

    formatBR(): string {
        return this.value.toLocaleDateString('pt-BR');
    }
}

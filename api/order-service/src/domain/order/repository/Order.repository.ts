import { Order } from "../entity/Order.entity";

export abstract class OrderRepository {
    abstract create(entity: Order): Promise<Order>;
    abstract findMany(id: string): Promise<Order | undefined>;
}
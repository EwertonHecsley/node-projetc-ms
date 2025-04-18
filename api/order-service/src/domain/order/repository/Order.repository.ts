import { Order } from "../entity/Order.entity";

export abstract class OrderRepository {
    abstract create(entity: Order): Promise<Order>;
    abstract find(id: string): Promise<Order | undefined>;
    abstract list(): Promise<Order[]>;
}
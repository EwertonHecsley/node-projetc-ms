import { OrderEntity } from "../entity/Order.entity";

export abstract class OrderRepository {
    abstract create(entity: OrderEntity): Promise<OrderEntity>;
    abstract findMany(id: string): Promise<OrderEntity | undefined>;
}
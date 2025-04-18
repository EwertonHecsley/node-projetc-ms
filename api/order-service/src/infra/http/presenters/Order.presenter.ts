import { Order } from "../../../domain/order/entity/Order.entity";

export class OrderPresenter {

    static toHTTP(entity: Order) {
        return {
            id: entity.id.valueId,
            products: entity.products,
            totalPrice: entity.totalPrice,
            orderDate: entity.orderDate,
            status: entity.status
        }
    }
}
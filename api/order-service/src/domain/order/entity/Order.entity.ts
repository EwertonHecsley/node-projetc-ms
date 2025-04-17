import Entity from "../../../core/generics/Entity";
import Identity from "../../../core/generics/Identity";
import { StatusOrder } from "../enums/StatusOrder";
import { OrderDate } from "../object-value/OrderDate";

type Product = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
}

type OrderProps = {
    products: Product[];
    totalPrice: number;
    orderDate: OrderDate;
    status: StatusOrder;
}

export class OrderEntity extends Entity<OrderProps> {

    static create(data: OrderProps, id?: Identity) {
        return new OrderEntity(
            {
                ...data,
                orderDate: OrderDate.now(),
            },
            id,
        )
    }

    get products(): Product[] {
        return this.attributes.products;
    }

    get totalPrice(): number {
        return this.attributes.totalPrice;
    }

    get orderDate(): OrderDate {
        return this.attributes.orderDate;
    }

    get status(): StatusOrder {
        return this.attributes.status;
    }

    set products(products: Product[]) {
        this.attributes.products = products;
    }

    set totalPrice(totalPrice: number) {
        this.attributes.totalPrice = totalPrice;
    }

    set orderDate(orderDate: OrderDate) {
        this.attributes.orderDate = orderDate;
    }

    set status(status: StatusOrder) {
        this.attributes.status = status;
    }
}
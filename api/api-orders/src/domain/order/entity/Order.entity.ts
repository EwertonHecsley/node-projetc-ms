import Entity from "../../../core/generics/Entity";
import Identity from "../../../core/generics/Identity";
import ItemOrder from "../../itemOder/entity/ItemOrder.entity";
import { Status } from "../enum/Status.enum";

type OrderType = {
    client: string;
    itemOrder: ItemOrder[];
    valueTotal: number;
    emailNotfication: string;
    status: Status;
    localDateTime: Date;
};

export class Order extends Entity<OrderType> {
    static create(data: OrderType, id?: Identity) {
        return new Order({ ...data }, id);
    }

    get client(): string {
        return this.attributes.client;
    }

    get itemOrder(): ItemOrder[] {
        return this.attributes.itemOrder;
    }

    get valueTotal(): number {
        return this.attributes.valueTotal;
    }

    get emailNotfication(): string {
        return this.attributes.emailNotfication;
    }

    get status(): Status {
        return this.attributes.status;
    }

    get localDateTime(): Date {
        return this.attributes.localDateTime;
    }

    set status(status: Status) {
        this.attributes.status = status;
    }

    addItemOrder(item: ItemOrder): void {
        this.attributes.itemOrder.push(item);
    }
}

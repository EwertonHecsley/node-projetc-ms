import Entity from "../../../core/generics/Entity";
import Identity from "../../../core/generics/Identity";
import Product from "../../product/entity/Product.entity"

type ItemOrderType = {
    product: Product;
    quantity: number;
}

export default class ItemOrder extends Entity<ItemOrderType> {
    static create(data: ItemOrderType, id?: Identity): ItemOrder {
        return new ItemOrder({ ...data }, id);
    }

    get product(): Product {
        return this.attributes.product;
    }

    get quantity(): number {
        return this.attributes.quantity;
    }

    set product(product: Product) {
        this.attributes.product = product;
    }

    set quantity(quantity: number) {
        this.attributes.quantity = quantity;
    }
}
import Entity from "../../../core/generics/Entity";
import Identity from "../../../core/generics/Identity";

type ProductType = {
    name: string;
    price: number;
    quantity: number;
    description: string;
}

export default class Product extends Entity<ProductType> {

    static create(data: ProductType, id?: Identity): Product {
        return new Product({ ...data }, id);
    }

    get name(): string {
        return this.attributes.name;
    }

    get price(): number {
        return this.attributes.price;
    }

    get quantity(): number {
        return this.attributes.quantity;
    }

    get description(): string {
        return this.attributes.description
    }

    set name(name: string) {
        this.attributes.name = name;
    }

    set price(price: number) {
        this.attributes.price = price;
    }

    set quantity(quantity: number) {
        this.attributes.quantity = quantity;
    }

    set description(description: string) {
        this.attributes.description;
    }
}
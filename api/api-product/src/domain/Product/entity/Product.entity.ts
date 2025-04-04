import Entity from "../../../core/generics/Entity";
import Identity from "../../../core/generics/Identity";

type ProductType = {
    name: string;
    price: number;
    description?: string;
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

    get description(): string | undefined {
        return this.attributes.description
    }

    set name(name: string) {
        this.attributes.name = name;
    }

    set price(price: number) {
        this.attributes.price = price;
    }

    set descriprion(descriprion: string) {
        this.attributes.description;
    }
}
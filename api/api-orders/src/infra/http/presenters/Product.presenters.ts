import Product from "../../domain/Product/entity/Product.entity";

export class ProductPresenter {

    static toHTTP(entity: Product) {
        return {
            id: entity.id.valueId,
            name: entity.name,
            price: entity.price,
            description: entity.description
        }
    }
}
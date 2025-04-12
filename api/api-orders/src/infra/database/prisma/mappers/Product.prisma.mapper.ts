import { Product as DatabaseProduct } from "@prisma/client";
import Product from "../../../../domain/Product/entity/Product.entity";
import Identity from "../../../../core/generics/Identity";


export class ProductPrismaMapper {

    static toDomain(entity: DatabaseProduct): Product {
        return Product.create(
            {
                name: entity.name,
                price: entity.price,
                description: entity.description ?? undefined
            },
            new Identity(entity.id)
        )
    }

    static toDatabase(entity: Product): DatabaseProduct {
        return {
            id: entity.id.valueId,
            name: entity.name,
            price: entity.price,
            description: entity.description ?? null
        }
    }
}
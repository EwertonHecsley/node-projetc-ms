import { Order as OrderDatabase, Prisma } from "@prisma/client";
import { Order } from "../../../../domain/order/entity/Order.entity";
import { OrderDate } from "../../../../domain/order/object-value/OrderDate";
import { StatusOrder } from "../../../../domain/order/enums/StatusOrder";
import Identity from "../../../../core/generics/Identity";

export type ExternalProduct = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
};

export class OrderPrismaMapper {
    static toDomain(entity: OrderDatabase, products: ExternalProduct[]): Order {
        return Order.create(
            {
                products,
                totalPrice: entity.totalPrice,
                orderDate: OrderDate.from(entity.orderDate),
                status: entity.status as StatusOrder,
            },
            new Identity(entity.id)
        );
    }

    static toDatabase(entity: Order): Prisma.OrderCreateInput {
        return {
            id: entity.id.valueId,
            products: entity.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                description: product.description,
            })) as Prisma.InputJsonValue,
            totalPrice: entity.totalPrice,
            orderDate: entity.orderDate.raw,
            status: entity.status as any,
        };
    }
}

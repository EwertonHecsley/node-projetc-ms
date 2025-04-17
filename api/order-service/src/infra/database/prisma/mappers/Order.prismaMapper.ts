import { Order as OrderDatabase, Prisma } from "@prisma/client";
import { Order } from "../../../../domain/order/entity/Order.entity";
import { OrderDate } from "../../../../domain/order/object-value/OrderDate";
import { StatusOrder } from "../../../../domain/order/enums/StatusOrder";
import { ProductCacheService } from "../../../cache/Redis.service";


export class OrderPrismaMapper {
    static async toDomain(entity: OrderDatabase): Promise<Order> {
        const fullProducts = await Promise.all(
            (entity.products as { id: string }[]).map(p => ProductCacheService.getProductById(p.id))
        );

        if (fullProducts.some(p => p === null)) {
            throw new Error('Produto(s) não encontrado(s) na cache.');
        }

        return Order.create({
            products: fullProducts as any,
            totalPrice: entity.totalPrice,
            orderDate: OrderDate.from(entity.orderDate),
            status: entity.status as StatusOrder,
        });
    }

    static toDatabase(entity: Order): Prisma.OrderCreateInput {
        return {
            id: entity.id.toString(),
            products: entity.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
            })) as Prisma.InputJsonValue,
            totalPrice: entity.totalPrice,
            orderDate: entity.orderDate.raw,
            status: entity.status as any,
        };
    }
}

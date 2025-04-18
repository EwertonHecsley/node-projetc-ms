import { Order } from "../../../domain/order/entity/Order.entity";
import { OrderRepository } from "../../../domain/order/repository/Order.repository";
import { ExternalProduct, OrderPrismaMapper } from "../prisma/mappers/Order.prismaMapper";
import getPrismaInstance from "../prisma/singleton.prisma";

export class OrderPrismaRepository implements OrderRepository {
    private prisma = getPrismaInstance();

    async create(entity: Order): Promise<Order> {
        const data = OrderPrismaMapper.toDatabase(entity);

        const order = await this.prisma.order.create({ data });

        return await OrderPrismaMapper.toDomain(order, entity.products);
    }


    async find(id: string): Promise<Order | undefined> {
        const order = await this.prisma.order.findUnique({ where: { id } });

        if (!order) {
            return undefined;
        }

        return OrderPrismaMapper.toDomain(order, order.products as ExternalProduct[]);
    }

    async list(): Promise<Order[]> {
        const result = await this.prisma.order.findMany();

        return result.map(order =>
            OrderPrismaMapper.toDomain(
                order,
                order.products as ExternalProduct[]
            )
        );
    }
}
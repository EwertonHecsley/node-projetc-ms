import Product from "../../../domain/product/entity/Product.entity";
import { ProductRepository } from "../../../domain/product/repository/Product.repository";
import { ProductPrismaMapper } from "../prisma/mappers/Product.prisma.mapper";
import getPrismaInstance from '../prisma/singleton.prisma';

export class ProductPrismaRepository implements ProductRepository {

    private prisma = getPrismaInstance();

    async create(product: Product): Promise<Product> {
        const data = ProductPrismaMapper.toDatabase(product);

        const result = await this.prisma.product.create({ data });

        return ProductPrismaMapper.toDomain(result);

    }

    async findById(id: string): Promise<Product | undefined> {
        const result = await this.prisma.product.findFirst({ where: { id } });

        if (!result) {
            return undefined;
        }

        return ProductPrismaMapper.toDomain(result)
    }

    async find(): Promise<Product[]> {
        const result = await this.prisma.product.findMany();

        return result.map(product => ProductPrismaMapper.toDomain(product));
    }

    async save(product: Product): Promise<void> {

        const data = ProductPrismaMapper.toDatabase(product);

        await this.prisma.product.update({ where: { id: data.id }, data });
    }

    async destroy(id: string): Promise<void> {
        await this.prisma.product.delete({ where: { id } });
    }

    async findName(name: string): Promise<Product | undefined> {
        const result = await this.prisma.product.findFirst({ where: { name } });

        if (!result) {
            return undefined;
        }

        return ProductPrismaMapper.toDomain(result);
    }
}
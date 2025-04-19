import Product from "../entity/Product.entity";

export abstract class ProductRepository {
    abstract create(product: Product): Promise<Product>;
    abstract findById(id: string): Promise<Product | undefined>;
    abstract find(): Promise<Product[]>
    abstract save(planet: Product): Promise<void>;
    abstract destroy(id: string): Promise<void>;
    abstract findName(name: string): Promise<Product | undefined>
}
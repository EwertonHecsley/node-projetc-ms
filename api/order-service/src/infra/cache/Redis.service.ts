import axios from 'axios';
import redis from '../cache/redis';

type Product = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
};

export class ProductCacheService {
    private static readonly cache_key = process.env.CACHE_KEY as unknown as string;

    static async getProducts(): Promise<Product[]> {
        const cached = await redis.get(this.cache_key);

        if (cached) {
            const parsed = JSON.parse(cached);
            return parsed.products;
        }

        const { data } = await axios.get<{ message: string; products: Product[] }>('http://localhost:3001/product');

        await redis.set(this.cache_key, JSON.stringify(data), 'EX', 60 * 5);

        return data.products;
    }


    static async getProductById(id: string): Promise<Product | null> {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || null;
    }
}

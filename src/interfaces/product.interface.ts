import { CreateProductInput } from "@/schema/product.schema.js";
import { Product } from "@prisma/client";

export default interface IProductRepository {
    create(product: CreateProductInput): Promise<Product>;
    findBySku(sku: string): Promise<Product | null>;
    // findAll(): Promise<Product[]>;
    // findById(id: string): Promise<Product | null>;
    // update(id: string, productData: Partial<CreateProductInput>): Promise<Product>;
    // delete(id: string): Promise<void>;
}
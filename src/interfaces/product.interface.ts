import { CreateProductInput, ListProductInput, UpdateProductInput } from "@/schema/product.schema.js";
import { Product } from "@prisma/client";

export type PaginatedProductsResult = {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default interface IProductRepository {
    create(product: CreateProductInput): Promise<Product>;
    findBySku(sku: string): Promise<Product | null>;
    findAll(params: ListProductInput): Promise<PaginatedProductsResult>;
    findById(id: string): Promise<Product | null>;
    update(id: string, data: UpdateProductInput): Promise<Product | null>;
    delete(id: string): Promise<void>;
}

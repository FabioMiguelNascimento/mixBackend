import IProductRepository from "@/interfaces/product.interface.js";
import { CreateProductInput } from "@/schema/product.schema.js";
import { Product } from "@prisma/client";
import { ConflictError } from '@/infrastructure/https/error/HttpErrors.js';

function generateSku(name: string): string {
    const sanitizedName = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .toUpperCase()
        .split(/\s+/)
        .slice(0, 3)
        .join("-");

    const uniqueIdentifier = Date.now().toString().slice(-6);

    return `${sanitizedName}-${uniqueIdentifier}`;
}

export default function makeCreateProduct(productRepository: IProductRepository) {
    return async function createProduct(productData: CreateProductInput): Promise<Product> {
        
        const productToCreate = { ...productData };

        if (!productToCreate.sku) {
            productToCreate.sku = generateSku(productToCreate.name);
        } else {
            const existingProduct = await productRepository.findBySku(productToCreate.sku);
            if (existingProduct) {
                throw new ConflictError('SKU já existe. Por favor, forneça um SKU único.');
            }
        }


        return productRepository.create(productToCreate);
    }
}
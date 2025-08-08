import IProductRepository from "@/interfaces/product.interface.js";
import prisma from "@/infrastructure/database/prisma.js";
import { CreateProductInput } from "@/schema/product.schema.js";
import { Prisma, Product } from "@prisma/client";

export default class ProductRepository implements IProductRepository {

    async create(product: CreateProductInput): Promise<Product> {
        const { categoryIds, tagIds, images, basketItems, ...productData } = product;

        const dataToCreate: Prisma.ProductCreateInput = {
            ...productData,
            // Categorias Obrigatórias
            productCategories: {
                create: categoryIds.map(categoryId => ({
                    category: { connect: { id: categoryId } },
                })),
            },
        };

        // Optional
        if (tagIds && tagIds.length > 0) {
            dataToCreate.productTags = {
                create: tagIds.map(tagId => ({
                    tag: { connect: { id: tagId } },
                })),
            };
        }

        if (images && images.length > 0) {
            dataToCreate.images = {
                create: images.map(image => ({ url: image.url })),
            };
        }

        if (basketItems && basketItems.length > 0) {
            dataToCreate.basketItems = {
                create: basketItems.map(item => ({
                    quantity: item.quantity,
                    product: { connect: { id: item.productId } },
                })),
            };
        }

        return prisma.product.create({
            data: dataToCreate,
            include: {
                productCategories: { include: { category: true } },
                productTags: { include: { tag: true } },
                images: true,
                basketItems: { include: { product: true } },
            }
        });
    }

    async findBySku(sku: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { sku },
        });
    }

}
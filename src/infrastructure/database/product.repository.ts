import IProductRepository from "@/interfaces/product.interface.js";
import prisma from "@/infrastructure/database/prisma.js";
import { CreateProductInput, ListProductInput } from "@/schema/product.schema.js";
import { Prisma, Product } from "@prisma/client";
import { PaginatedProductsResult } from "@/interfaces/product.interface.js";

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

    async findAll(params: ListProductInput): Promise<PaginatedProductsResult> {
        const { page, limit, search, categoryIds, tagIds, status, type, minPrice, maxPrice, sortBy, sortOrder } = params;

        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        if (categoryIds && categoryIds.length > 0) {
            where.productCategories = {
                some: { categoryId: { in: categoryIds } },
            };
        }

        if (tagIds && tagIds.length > 0) {
            where.productTags = {
                some: { tagId: { in: tagIds } },
            };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.finalPrice = {};
            if (minPrice !== undefined) {
                where.finalPrice.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                where.finalPrice.lte = maxPrice;
            }
        }

        const total = await prisma.product.count({ where });

        const products = await prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                productCategories: { include: { category: true } },
                productTags: { include: { tag: true } },
                images: true,
            },
        });

        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}

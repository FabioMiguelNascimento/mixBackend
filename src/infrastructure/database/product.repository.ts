import IProductRepository from "@/interfaces/product.interface.js";
import prisma from "@/infrastructure/database/prisma.js";
import { CreateProductInput, ListProductInput, UpdateProductInput } from "@/schema/product.schema.js";
import { Prisma, Product } from "@prisma/client";
import { PaginatedProductsResult } from "@/interfaces/product.interface.js";
import { NotFoundError } from "../https/error/HttpErrors.js";

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
                create: images.map(image => ({ key: image.key })),
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

    async findById(id: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
            include: {
                productCategories: { include: { category: true } },
                productTags: { include: { tag: true } },
                images: true,
                basketItems: { include: { product: true } },
            },
        });
    }

    async update(id: string, data: UpdateProductInput): Promise<Product | null> {
        const { categoryIds, tagIds, images, basketItems, ...productData } = data;

        return prisma.$transaction(async (tx) => {
            const existingProduct = await tx.product.findUnique({
                where: { id },
                include: {
                    productCategories: true,
                    productTags: true,
                    images: true,
                    basketItems: true,
                },
            });

            if (!existingProduct) {
                throw new NotFoundError(`Produto com ID ${id} não encontrado.`);
            }

            const dataToUpdate: Prisma.ProductUpdateInput = { ...productData };

            // Handle categories update
            if (categoryIds) {
                await tx.productCategory.deleteMany({ where: { productId: id } });
                dataToUpdate.productCategories = {
                    create: categoryIds.map(categoryId => ({
                        category: { connect: { id: categoryId } },
                    })),
                };
            }

            // Handle tags update
            if (tagIds) {
                await tx.productTag.deleteMany({ where: { productId: id } });
                dataToUpdate.productTags = {
                    create: tagIds.map(tagId => ({
                        tag: { connect: { id: tagId } },
                    })),
                };
            }

            // Handle images update
            if (images) {
                await tx.image.deleteMany({ where: { productId: id } });
                dataToUpdate.images = {
                    create: images.map(image => ({ key: image.key })),
                };
            }

            // Handle basket items update (more complex)
            if (basketItems) {
                // Delete existing basket items for this product
                await tx.basketItem.deleteMany({ where: { basketId: id } });

                // Create new basket items
                dataToUpdate.basketItems = {
                    create: basketItems.map(item => ({
                        quantity: item.quantity,
                        product: { connect: { id: item.productId } },
                    })),
                };
            }

            const updatedProduct = await tx.product.update({
                where: { id },
                data: dataToUpdate,
                include: {
                    productCategories: { include: { category: true } },
                    productTags: { include: { tag: true } },
                    images: true,
                    basketItems: { include: { product: true } },
                },
            });

            return updatedProduct;
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.product.delete({
            where: { id },
        });
    }
}


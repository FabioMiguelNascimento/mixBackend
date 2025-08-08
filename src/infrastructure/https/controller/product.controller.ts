import ProductRepository from '@/infrastructure/database/product.repository.js';
import { CreateProductInput } from '@/schema/product.schema.js';
import makeCreateProduct from '@/use-cases/product/createProduct.js';
import { Request, Response, NextFunction } from 'express';

const productRepository = new ProductRepository()

export const handleCreateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData: CreateProductInput = req.validatedData;

    const createProductCase = makeCreateProduct(productRepository)
    const product = await createProductCase(productData);

    res.status(201).json({ code: 201, message: 'Produto criado com sucesso', data: product });
  } catch (error) {
    next(error);
  }
};

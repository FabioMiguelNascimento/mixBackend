import { Request, Response, NextFunction } from 'express';
import ProductRepository from '@/infrastructure/database/product.repository.js';
import makeCreateProduct from '@/use-cases/product/createProduct.js';
import makeFindAllProducts from '@/use-cases/product/findAllProducts.js';
import { CreateProductInput, ListProductInput } from '@/schema/product.schema.js';

const productRepository = new ProductRepository();

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

export const handleFindAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params: ListProductInput = req.validatedData;

    const findAllProductsCase = makeFindAllProducts(productRepository);
    const result = await findAllProductsCase(params);

    res.status(200).json({ code: 200, message: 'Produtos encontrados com sucesso', data: result });
  } catch (error) {
    next(error);
  }
}
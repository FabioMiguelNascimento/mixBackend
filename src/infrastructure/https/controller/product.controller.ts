import { Request, Response, NextFunction } from 'express';
import ProductRepository from '@/infrastructure/database/product.repository.js';
import makeCreateProduct from '@/use-cases/product/createProduct.js';
import makeFindAllProducts from '@/use-cases/product/findAllProducts.js';
import { CreateProductInput, ListProductInput, UpdateProductInput } from '@/schema/product.schema.js';
import makeFindProduct from '@/use-cases/product/findById.js';
import makeUpdateProduct from '@/use-cases/product/updateProduct.js';
import makeDeleteProduct from '@/use-cases/product/deleteProduct.js';

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

export const handleFindProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.validatedData;

    const findProductCase = makeFindProduct(productRepository)
    const product = await findProductCase(id);

    res.status(200).json({ code: 200, message: "Produto encontrado com sucesso", data: product });
  } catch (err) {
    next(err)
  }
}

export const handleUpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.validatedData;
    const data: UpdateProductInput = req.validatedData;

    const updateProductCase = makeUpdateProduct(productRepository);
    const updatedProduct = await updateProductCase(id, data);

    res.status(200).json({ code: 200, message: 'Produto atualizado com sucesso', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.validatedData;

    const deleteProductCase = makeDeleteProduct(productRepository);
    await deleteProductCase(id);

    res.status(204).send({ code: 204, message: "Produto deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};

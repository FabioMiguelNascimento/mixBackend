import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import IImageRepository from "@/interfaces/image.interface.js";
import IProductRepository from "@/interfaces/product.interface.js";
import { StorageService } from "@/services/storageService.js";
import { Image } from "@prisma/client";

export default function makeAddProductImage(
  productRepository: IProductRepository,
  imageRepository: IImageRepository,
  storageService: StorageService
) {
  return async function addProductImage(
    productId: string,
    file: Express.Multer.File
  ): Promise<Image> {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const prefix = `products/${productId}`;
    const { key } = await storageService.uploadFile(file, prefix);

    const newImage = await imageRepository.create(productId, key);

    return newImage;
  };
}

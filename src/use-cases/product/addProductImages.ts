import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import IProductRepository from "@/interfaces/product.interface.js";
import IImageRepository from "@/interfaces/image.interface.js";
import { StorageService } from "@/services/storageService.js";
import { Image } from "@prisma/client";

export default function makeAddProductImages(productRepository: IProductRepository, imageRepository: IImageRepository, storageService: StorageService) {
    return async function addProductImages(productId: string, files: Express.Multer.File[]): Promise<Image[]> {
        const product = await productRepository.findById(productId);

        if (!product) {
            throw new NotFoundError("Produto não encontrado.");
        }

        const images: Image[] = [];

        for (const file of files) {
            const { key } = await storageService.uploadFile(file, `products/${productId}`);
            const image = await imageRepository.create({
                key,
                productId,
            });
            images.push(image);
        }

        return images;
    }
}

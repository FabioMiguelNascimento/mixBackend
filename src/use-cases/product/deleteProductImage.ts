import { NotFoundError } from "@/infrastructure/https/error/HttpErrors.js";
import IImageRepository from "@/interfaces/image.interface.js";
import { StorageService } from "@/services/storageService.js";

export default function makeDeleteProductImage(
  imageRepository: IImageRepository,
  storageService: StorageService
) {
  return async function deleteProductImage(imageId: string): Promise<void> {
    const image = await imageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundError("Imagem não encontrada.");
    }

    await storageService.deleteFile(image.key);

    await imageRepository.deleteById(imageId);
  };
}

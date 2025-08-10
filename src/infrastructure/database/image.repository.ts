import prisma from "@/infrastructure/database/prisma.js";
import IImageRepository from "@/interfaces/image.interface.js";
import { Image } from "@prisma/client";

export default class ImageRepository implements IImageRepository {
  async create(productId: string, key: string): Promise<Image> {
    return prisma.image.create({
      data: {
        productId,
        key,
      },
    });
  }

  async findById(id: string): Promise<Image | null> {
    return prisma.image.findUnique({
      where: { id },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.image.delete({
      where: { id },
    });
  }
}

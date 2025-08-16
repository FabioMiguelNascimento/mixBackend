import prisma from "@/infrastructure/database/prisma.js";
import IImageRepository from "@/interfaces/image.interface.js";
import { CreateImageInput } from "@/schema/product.schema.js";
import { Image } from "@prisma/client";

export default class ImageRepository implements IImageRepository {
  async create(data: CreateImageInput): Promise<Image> {
    return prisma.image.create({
      data,
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

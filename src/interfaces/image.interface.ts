import { Image } from "@prisma/client";

export default interface IImageRepository {
  create(productId: string, key: string): Promise<Image>;
  findById(id: string): Promise<Image | null>;
  deleteById(id: string): Promise<void>;
}

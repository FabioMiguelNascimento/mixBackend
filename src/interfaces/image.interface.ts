import { CreateImageInput } from "@/schema/product.schema.js";
import { Image } from "@prisma/client";

export default interface IImageRepository {
  create(data: CreateImageInput): Promise<Image>;
  findById(id: string): Promise<Image | null>;
  deleteById(id: string): Promise<void>;
}

import { BUCKET_NAME, s3Client } from "@/utils/s3client.js";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

export class StorageService {
  #cleanKey(key: string): string {
    return key.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
  }

  async uploadFile(
    fileData: { originalname: string; buffer: Buffer; mimetype: string },
    prefix: string,
    bucketName: string = BUCKET_NAME!
  ) {
    const cleanPrefix = this.#cleanKey(prefix);
    const fileExtension = fileData.originalname.split('.').pop() || 'bin';
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const finalKey = `${cleanPrefix}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME!,
      Key: finalKey,
      Body: fileData.buffer,
      ContentType: fileData.mimetype,
    });

    try {
      await s3Client.send(command);
      return { key: finalKey };
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }
  }

  async uploadJSON(key: string, jsonData: any) {
    const cleanKey = this.#cleanKey(key);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cleanKey,
      Body: JSON.stringify(jsonData, null, 2),
      ContentType: "application/json",
    });

    try {
      await s3Client.send(command);
      return { key: cleanKey };
    } catch (error: any) {
      console.error("Upload JSON error:", error);
      throw new Error(`Erro ao fazer upload do JSON: ${error.message}`);
    }
  }

  async getFile(key: string, bucketName: string = BUCKET_NAME!) {
    const cleanKey = this.#cleanKey(key);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
    });

    try {
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      return signedUrl;
    } catch (error: any) {
      throw new Error(`Erro ao buscar arquivo: ${error.message}`);
    }
  }

  async getBatchFiles(keys: string[], bucketName: string = BUCKET_NAME!): Promise<Record<string, string | null>> {
    const urlMap: Record<string, string | null> = {};

    try {
      const promises = keys.map(async (key) => {
        try {
          const url = await this.getFile(key, bucketName);
          urlMap[key] = url;
        } catch (error) {
          console.error(`Erro ao buscar URL para chave ${key}:`, error);
          urlMap[key] = null;
        }
      });

      await Promise.all(promises);
      return urlMap;
    } catch (error: any) {
      throw new Error(`Erro ao buscar arquivos em lote: ${error.message}`);
    }
  }

  async deleteFile(key: string) {
    const cleanKey = this.#cleanKey(key);

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME!,
      Key: cleanKey,
    });

    try {
      await s3Client.send(command);
    } catch (error: any) {
      console.error("Delete error:", error);
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }
  }

  async deleteFolder(prefix: string) {
    const cleanPrefix = this.#cleanKey(prefix);

    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME!,
      Prefix: cleanPrefix,
    });

    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log(`Nenhum arquivo encontrado no prefixo ${cleanPrefix} para deletar.`);
      return;
    }

    const deleteParams = {
      Bucket: BUCKET_NAME!,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);

    try {
      await s3Client.send(deleteCommand);
      console.log(`Todos os arquivos no prefixo ${cleanPrefix} foram deletados com sucesso.`);
    } catch (error: any) {
      console.error(`Erro ao deletar arquivos do prefixo ${cleanPrefix}:`, error);
      throw new Error(`Erro ao deletar o diretório da empresa: ${error.message}`);
    }
  }
}

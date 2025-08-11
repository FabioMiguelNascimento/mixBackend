import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { BUCKET_NAME, s3Client } from "../../../utils/s3client.js";
import { BadRequestError, NotFoundError } from "../error/HttpErrors.js";
import { StorageService } from "../../../services/storageService.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const storageService = new StorageService();

export const handleFileDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.validatedData;

    const file = await doesFileExist(key);
    if(!file) {
      throw new NotFoundError("Arquivo não encontrado");
    }

    await storageService.deleteFile(key);
    
    res.status(200).json({ 
      code: 200,
      message: "Arquivo deletado com sucesso" 
    });
  } catch (error: any) {
    next(error);
  }
};

export const handleFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileData = req.file;
    const { prefix } = req.body;

    if (!prefix) {
      throw new BadRequestError("Prefixo (prefix) é obrigatório no body da requisição");
    }

    if (!fileData) {
      throw new BadRequestError("Arquivo não encontrado na requisição");
    }

    const result = await storageService.uploadFile(fileData, prefix);
    const url = await storageService.getFile(result.key);
    
    res.status(200).json({ 
      code: 200,
      message: "Upload realizado com sucesso",
      data: { ...result, url }
    });
  } catch (error: any) {
    next(error);
  }
};


export const handleFileDownload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.validatedData;

    const file = await doesFileExist(key);
    if(!file) {
      throw new NotFoundError("Arquivo não encontrado");
    }

    const url = await storageService.getFile(key);
    
    res.status(200).json({ 
      code: 200,
      message: "Download disponível",
      data: { url }
    });
  } catch (error: any) {
    next(error);
  }
};

const doesFileExist = async (key: string) => {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}
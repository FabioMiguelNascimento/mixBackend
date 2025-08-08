import multer from 'multer';
import { BadRequestError } from '@/infrastructure/errors/HttpErrors.js';

export const MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  audio: ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
};

const createUploadMiddleware = (allowedMimes: string[], sizeLimit: number) => {
  const storage = multer.memoryStorage();

  return multer({
    storage: storage,
    limits: {
      fileSize: sizeLimit,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError(`Tipo de arquivo inválido. Permitidos: ${allowedMimes.join(', ')}`));
      }
    },
  });
};

export const uploadAudio = createUploadMiddleware(MIME_TYPES.audio, 10 * 1024 * 1024); // 10 MB
export const uploadImage = createUploadMiddleware(MIME_TYPES.image, 5 * 1024 * 1024); // 5 MB
export const uploadVideo = createUploadMiddleware(MIME_TYPES.video, 50 * 1024 * 1024); // 50 MB


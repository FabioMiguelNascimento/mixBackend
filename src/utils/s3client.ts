
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import https from "https";

function getValidatedS3Config() {
  const config = {
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
  };

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Variável de ambiente para S3 não encontrada: ${key}`);
    }
  }
  
  return config;
}

const validatedConfig = getValidatedS3Config();

export const BUCKET_NAME: string | undefined = validatedConfig.bucketName;

const insecureAgent = new https.Agent({ rejectUnauthorized: false });
const agent = process.env.NODE_ENV !== 'production' ? insecureAgent : undefined;

const s3ClientConfig: S3ClientConfig = {
    region: "auto",
    endpoint: validatedConfig.endpoint,
    credentials: {
      accessKeyId: validatedConfig.accessKeyId,
      secretAccessKey: validatedConfig.secretAccessKey,
    },
    forcePathStyle: true,
    ...(agent && {
      requestHandler: {
        httpAgent: agent,
        httpsAgent: agent,
      },
    }),
};

export const s3Client = new S3Client(s3ClientConfig);
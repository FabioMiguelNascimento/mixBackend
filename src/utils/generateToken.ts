import "dotenv/config";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { Role } from "@prisma/client";

export function generateAccessToken(id: string, role: Role): string {
  const secretEnv = process.env.JWT_SECRET;
  const timeEnv = process.env.JWT_TIME;

  if (!secretEnv) {
    throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
  }
  const SECRET: Secret = secretEnv;

  if (!timeEnv) {
    throw new Error("JWT_TIME não está definido nas variáveis de ambiente.");
  }
  const TIME: StringValue = timeEnv as StringValue;
  
  const payload = {
    id: id,
    role: role,
  };

  const options: SignOptions = { expiresIn: TIME };

  return jwt.sign(payload, SECRET, options);
}

export function generateRefreshToken(id: string): string {
  const secretEnv = process.env.JWT_REFRESH_SECRET;
  const timeEnv = process.env.JWT_REFRESH_TIME;

  if (!secretEnv) {
    throw new Error("JWT_REFRESH_SECRET não está definido nas variáveis de ambiente.");
  }
  const SECRET: Secret = secretEnv;

  if (!timeEnv) {
    throw new Error("JWT_REFRESH_TIME não está definido nas variáveis de ambiente.");
  }
  const TIME: StringValue = timeEnv as StringValue;
  
  const payload = {
    id: id,
  };

  const options: SignOptions = { expiresIn: TIME };

  return jwt.sign(payload, SECRET, options);
}
  
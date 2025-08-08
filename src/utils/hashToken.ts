import crypto from 'crypto';

/**
 * Gera um hash SHA256 de uma string.
 * @param token A string a ser hasheada.
 * @returns O hash SHA256 em formato hexadecimal.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

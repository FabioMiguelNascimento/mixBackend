import * as bcrypt from 'bcrypt';

const SALT = 10;

export function encodePassword(rawPassword: string): string {
    return bcrypt.hashSync(rawPassword, SALT);
}

export function decodePassword(hashedPassword: string, plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

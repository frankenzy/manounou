import bcrypt from "bcryptjs";

const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export function isBcryptHash(value: string): boolean {
   return BCRYPT_HASH_REGEX.test(value);
}

export async function hashPassword(password: string): Promise<string> {
   return bcrypt.hash(password, 10);
}

interface PasswordVerificationResult {
   isValid: boolean;
   needsRehash: boolean;
}

export async function verifyPasswordWithLegacySupport(
   plainPassword: string,
   storedPassword: string,
): Promise<PasswordVerificationResult> {
   if (isBcryptHash(storedPassword)) {
      const isValid = await bcrypt.compare(plainPassword, storedPassword);
      return { isValid, needsRehash: false };
   }

   const isValid = plainPassword === storedPassword;
   return { isValid, needsRehash: isValid };
}
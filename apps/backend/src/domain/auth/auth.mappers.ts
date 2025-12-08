import { Encryption, encryptionSchema, User } from '@zeronotes/shared';
import type { UserRow } from './auth.types';

export const authMappers = {
  rowToUser: (row: UserRow): User => ({
    id: row.id,
    email: row.email,
  }),

  rowToEncryption: (row: UserRow): Encryption =>
    encryptionSchema.parse({
      salt: row.encryption_salt,
      wrappedDataKey: row.wrapped_data_key,
      kdfIterations: row.kdf_iterations,
      version: row.encryption_version,
    }),
};

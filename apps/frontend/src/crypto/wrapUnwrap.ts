import { ENCRYPTION_VERSION, KDF_ITERATIONS, type Encryption } from '@zeronotes/shared';
import {
  AES_ALGORITHM,
  GCM_IV_LENGTH,
  concatArrays,
  decodeBase64,
  encodeBase64,
  getSubtleCrypto,
  toUint8Array,
} from './core';
import { deriveKEK } from './deriveKek';

const SALT_LENGTH = 16;

export const wrapDataKey = async (dataKey: CryptoKey, kek: CryptoKey): Promise<string> => {
  const subtle = getSubtleCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH));

  const wrapped = await subtle.wrapKey('raw', dataKey, kek, {
    name: AES_ALGORITHM,
    iv,
  });

  const combined = concatArrays(iv, toUint8Array(wrapped));
  return encodeBase64(combined.buffer);
};

export const unwrapDataKey = async (wrappedBase64: string, kek: CryptoKey): Promise<CryptoKey> => {
  const subtle = getSubtleCrypto();
  const combined = new Uint8Array(decodeBase64(wrappedBase64));

  const iv = combined.slice(0, GCM_IV_LENGTH);
  const ciphertext = combined.slice(GCM_IV_LENGTH);

  return subtle.unwrapKey(
    'raw',
    ciphertext.buffer,
    kek,
    {
      name: AES_ALGORITHM,
      iv,
    },
    {
      name: AES_ALGORITHM,
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
};

export const createEncryption = async (
  password: string,
): Promise<{ encryption: Encryption; dataKey: CryptoKey }> => {
  const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const saltBase64 = encodeBase64(saltBytes.buffer);

  const kek = await deriveKEK(password, saltBase64, KDF_ITERATIONS);

  const subtle = getSubtleCrypto();
  const dataKey = await subtle.generateKey(
    {
      name: AES_ALGORITHM,
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const wrappedDataKey = await wrapDataKey(dataKey, kek);

  const encryption: Encryption = {
    salt: saltBase64,
    wrappedDataKey,
    kdfIterations: KDF_ITERATIONS,
    version: ENCRYPTION_VERSION,
  };

  return { encryption, dataKey };
};

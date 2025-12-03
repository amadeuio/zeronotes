import type { Encryption } from '@zeronotes/shared';
import {
  AES_ALGORITHM,
  ENCRYPTION_VERSION,
  GCM_IV_LENGTH,
  PBKDF2_HASH,
  concatArrays,
  decodeBase64,
  encodeBase64,
  encodeText,
  getSubtleCrypto,
  toUint8Array,
} from './core';

const DEFAULT_KDF_ITERATIONS = 100_000;
const SALT_LENGTH = 16;

export const deriveKEK = async (
  password: string,
  saltBase64: string,
  iterations: number,
): Promise<CryptoKey> => {
  const subtle = getSubtleCrypto();
  const salt = decodeBase64(saltBase64);

  const passwordKey = await subtle.importKey(
    'raw',
    encodeText(password) as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: PBKDF2_HASH,
    },
    passwordKey,
    {
      name: AES_ALGORITHM,
      length: 256,
    },
    false,
    ['wrapKey', 'unwrapKey'],
  );
};

export const deriveKEKFromEncryption = async (
  password: string,
  encryption: Encryption,
): Promise<CryptoKey> => deriveKEK(password, encryption.salt, encryption.kdfIterations);

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

export const createEncryptionParamsForPassword = async (
  password: string,
): Promise<{ encryption: Encryption; dataKey: CryptoKey }> => {
  const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const saltBase64 = encodeBase64(saltBytes.buffer);
  const kdfIterations = DEFAULT_KDF_ITERATIONS;

  const kek = await deriveKEK(password, saltBase64, kdfIterations);

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
    kdfIterations,
    version: ENCRYPTION_VERSION,
  };

  return { encryption, dataKey };
};

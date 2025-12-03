import {
  AES_ALGORITHM,
  ENCRYPTION_VERSION,
  type EncryptedString,
  GCM_IV_LENGTH,
  concatArrays,
  decodeBase64,
  decodeText,
  encodeBase64,
  encodeText,
  getSubtleCrypto,
  packVersionedPayload,
  toUint8Array,
  unpackVersionedPayload,
} from './core';

export const encryptString = async (
  plaintext: string,
  dataKey: CryptoKey,
): Promise<EncryptedString> => {
  const subtle = getSubtleCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH));
  const encoded = encodeText(plaintext);

  const ciphertext = await subtle.encrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    dataKey,
    encoded as BufferSource,
  );

  const combined = concatArrays(iv, toUint8Array(ciphertext));
  const payloadBase64 = encodeBase64(combined.buffer);
  return packVersionedPayload(ENCRYPTION_VERSION, payloadBase64);
};

export const decryptString = async (
  encrypted: EncryptedString,
  dataKey: CryptoKey,
): Promise<string> => {
  const subtle = getSubtleCrypto();
  const { version, payloadBase64 } = unpackVersionedPayload(encrypted);

  if (version !== ENCRYPTION_VERSION) {
    throw new Error(`Unsupported encryption version: ${version}`);
  }

  const combined = new Uint8Array(decodeBase64(payloadBase64));
  const iv = combined.slice(0, GCM_IV_LENGTH);
  const ciphertext = combined.slice(GCM_IV_LENGTH);

  const decrypted = await subtle.decrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    dataKey,
    ciphertext,
  );

  return decodeText(decrypted);
};

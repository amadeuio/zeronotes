import { AES_ALGORITHM, PBKDF2_HASH, decodeBase64, encodeText, getSubtleCrypto } from './core';

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

import type { Encryption } from '@zeronotes/shared';

const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

const AES_ALGORITHM = 'AES-GCM';
const GCM_IV_LENGTH = 12; // 96-bit IV as recommended for GCM
const PBKDF2_HASH = 'SHA-256';
const ENCRYPTION_VERSION = 1;
const DEFAULT_KDF_ITERATIONS = 100_000;
const SALT_LENGTH = 16;

export type EncryptedString = string;

let currentDataKey: CryptoKey | null = null;

/** Gets the WebCrypto SubtleCrypto API from the browser environment. */
const getSubtleCrypto = (): SubtleCrypto => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  throw new Error('WebCrypto is not available in this environment');
};

/** Converts an ArrayBufferLike to a Uint8Array. */
const toUint8Array = (buffer: ArrayBufferLike): Uint8Array => new Uint8Array(buffer);

/** Concatenates two Uint8Arrays into a single array. */
const concatArrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
};

/** Encodes an ArrayBuffer to a base64 string. */
const encodeBase64 = (buffer: ArrayBufferLike): string => {
  const bytes = toUint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/** Decodes a base64 string to an ArrayBuffer. */
const decodeBase64 = (value: string): ArrayBuffer => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/** Packs version and base64 payload into a versioned encrypted string format. */
const packVersionedPayload = (version: number, payloadBase64: string): EncryptedString =>
  `${version}:${payloadBase64}`;

/** Unpacks a versioned encrypted string to extract version and base64 payload. */
const unpackVersionedPayload = (
  value: EncryptedString,
): { version: number; payloadBase64: string } => {
  const [versionStr, payloadBase64] = value.split(':', 2);
  const version = Number.parseInt(versionStr, 10);
  if (!Number.isFinite(version) || !payloadBase64) {
    throw new Error('Invalid encrypted payload format');
  }
  return { version, payloadBase64 };
};

/** Derives a Key Encryption Key (KEK) from a password using PBKDF2. */
export const deriveKEK = async (
  password: string,
  saltBase64: string,
  iterations: number,
): Promise<CryptoKey> => {
  const subtle = getSubtleCrypto();
  const salt = decodeBase64(saltBase64);

  const passwordKey = await subtle.importKey(
    'raw',
    TEXT_ENCODER.encode(password),
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

/** Derives a KEK from a password using encryption configuration (salt and iterations). */
export const deriveKEKFromEncryption = async (
  password: string,
  encryption: Encryption,
): Promise<CryptoKey> => deriveKEK(password, encryption.salt, encryption.kdfIterations);

/** Wraps (encrypts) a data key with a Key Encryption Key, returning base64-encoded IV + ciphertext. */
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

/** Unwraps (decrypts) a data key from base64-encoded IV + ciphertext using a KEK. */
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

/** Encrypts a plaintext string using a data key, returning a versioned encrypted string. */
export const encryptString = async (
  plaintext: string,
  dataKey: CryptoKey,
): Promise<EncryptedString> => {
  const subtle = getSubtleCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH));
  const encoded = TEXT_ENCODER.encode(plaintext);

  const ciphertext = await subtle.encrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    dataKey,
    encoded,
  );

  const combined = concatArrays(iv, toUint8Array(ciphertext));
  const payloadBase64 = encodeBase64(combined.buffer);
  return packVersionedPayload(ENCRYPTION_VERSION, payloadBase64);
};

/** Decrypts a versioned encrypted string using a data key, returning the plaintext. */
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

  return TEXT_DECODER.decode(decrypted);
};

/** Sets the in-memory global data key used for encrypting/decrypting notes and labels. */
export const setDataKey = (key: CryptoKey | null): void => {
  currentDataKey = key;
};

/** Returns the current in-memory data key, or null if none is set. */
export const getDataKey = (): CryptoKey | null => currentDataKey;

/**
 * Returns the current in-memory data key or throws if it is not available.
 * Callers should handle this by redirecting the user to login / unlock flow.
 */
export const requireDataKey = (): CryptoKey => {
  if (!currentDataKey) {
    throw new Error('Encryption key is not available. Please login again to unlock your notes.');
  }
  return currentDataKey;
};

/**
 * Creates encryption parameters for a given password:
 * - generates a random salt
 * - derives a KEK via PBKDF2
 * - generates a random data key
 * - wraps the data key with the KEK
 *
 * Returns both the persisted Encryption config and the in-memory data key.
 */
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

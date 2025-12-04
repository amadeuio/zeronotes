const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

export const AES_ALGORITHM = 'AES-GCM';
export const GCM_IV_LENGTH = 12;
export const PBKDF2_HASH = 'SHA-256';

export type EncryptedString = string;

export const getSubtleCrypto = (): SubtleCrypto => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  throw new Error('WebCrypto is not available in this environment');
};

export const toUint8Array = (buffer: ArrayBufferLike): Uint8Array => new Uint8Array(buffer);

export const concatArrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
};

export const encodeBase64 = (buffer: ArrayBufferLike): string => {
  const bytes = toUint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const decodeBase64 = (value: string): ArrayBuffer => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export const packVersionedPayload = (version: number, payloadBase64: string): EncryptedString =>
  `${version}:${payloadBase64}`;

export const unpackVersionedPayload = (
  value: EncryptedString,
): { version: number; payloadBase64: string } => {
  const [versionStr, payloadBase64] = value.split(':', 2);
  const version = Number.parseInt(versionStr, 10);
  if (!Number.isFinite(version) || !payloadBase64) {
    throw new Error('Invalid encrypted payload format');
  }
  return { version, payloadBase64 };
};

export const encodeText = (value: string): Uint8Array => TEXT_ENCODER.encode(value);

export const decodeText = (buffer: ArrayBuffer): string => TEXT_DECODER.decode(buffer);

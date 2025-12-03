let currentDataKey: CryptoKey | null = null;

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

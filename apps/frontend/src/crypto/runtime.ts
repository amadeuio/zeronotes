let currentDataKey: CryptoKey | null = null;

export const setDataKey = (key: CryptoKey | null): void => {
  currentDataKey = key;
};

export const getDataKey = (): CryptoKey | null => currentDataKey;

export const requireDataKey = (): CryptoKey => {
  if (!currentDataKey) {
    throw new Error('Encryption key is not available. Please login again to unlock your notes.');
  }
  return currentDataKey;
};

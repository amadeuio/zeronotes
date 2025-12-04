import { decryptString } from '@/crypto';
import type { Label } from '@zeronotes/shared';

export const decryptLabels = async (labels: Label[], dataKey: CryptoKey) => {
  const labelsById: Record<string, Label> = {};

  await Promise.all(
    labels.map(async (label) => {
      const name = await decryptString(label.name, dataKey);
      labelsById[label.id] = { ...label, name };
    }),
  );

  return labelsById;
};

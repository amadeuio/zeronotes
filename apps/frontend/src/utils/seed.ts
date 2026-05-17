import { encryptString } from '@/crypto';
import { welcomeLabels, welcomeNotes } from '@/data/welcomeSeed';
import type { Label, Note, SeedContentBody } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';

export const buildEncryptedWelcomeSeed = async (dataKey: CryptoKey): Promise<SeedContentBody> => {
  const labelIdsByKey: Record<string, string> = {};

  const labels: Label[] = welcomeLabels.map((label) => {
    const id = uuidv4();
    labelIdsByKey[label.key] = id;
    return { id, name: label.name };
  });

  const notes: Note[] = welcomeNotes.map((note) => {
    const { labelKeys, ...rest } = note;
    return {
      ...rest,
      id: uuidv4(),
      labelIds: labelKeys.map((key) => labelIdsByKey[key]),
    };
  });

  return {
    labels: await Promise.all(
      labels.map(async (label) => ({
        ...label,
        name: await encryptString(label.name, dataKey),
      })),
    ),
    notes: await Promise.all(
      notes.map(async (note) => ({
        ...note,
        title: await encryptString(note.title, dataKey),
        content: await encryptString(note.content, dataKey),
      })),
    ),
  };
};

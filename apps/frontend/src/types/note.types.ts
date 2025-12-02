import type { Label, Note } from '@zeronotes/shared';

export type DisplayNote = Omit<Note, 'labelIds'> & {
  labels: Label[];
  colorValue: string | null;
};

export type DraftNote = Omit<Note, 'id' | 'isTrashed'>;

import type { Label } from '@/types';

export interface Note {
  id: string;
  title: string;
  content: string;
  colorId: string;
  labelIds: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
}

export type DisplayNote = Omit<Note, 'labelIds'> & {
  labels: Label[];
  colorValue: string | null;
};

export type DraftNote = Omit<Note, 'id' | 'isTrashed'>;

export type NoteDto = Note & {
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

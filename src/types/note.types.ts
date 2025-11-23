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

export interface DisplayNote extends Omit<Note, 'labelIds'> {
  labels: Label[];
  colorValue: string | null;
}

export type DraftNote = Omit<DisplayNote, 'id' | 'isTrashed' | 'colorValue'>;

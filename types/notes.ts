export interface Note {
  id: string;
  title: string;
  content: string;
  colorId: string;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
}

export type CreateNoteRequest = {
  id: string;
  title: string;
  content: string;
  colorId: string;
  isPinned: boolean;
  isArchived: boolean;
  labelIds: string[];
};

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  colorId?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
}

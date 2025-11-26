export interface NoteDB {
  id: string;
  order: number;
  title: string;
  content: string;
  color_id: string;
  is_pinned: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NoteAPI {
  id: string;
  order: number;
  title: string;
  content: string;
  colorId: string;
  labelIds: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
}

export interface NoteCreateRequest {
  id: string;
  title?: string;
  content?: string;
  colorId?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  labelIds?: string[];
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  colorId?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
}

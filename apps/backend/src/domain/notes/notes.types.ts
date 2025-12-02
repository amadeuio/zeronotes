export interface NoteRow {
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

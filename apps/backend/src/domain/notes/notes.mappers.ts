import { Note } from '@zeronotes/shared';
import { NoteRow } from './notes.types';

export const noteMappers = {
  rowToNote: (row: NoteRow & { label_ids?: string[] }): Note => ({
    id: row.id,
    title: row.title,
    content: row.content,
    colorId: row.color_id,
    isPinned: row.is_pinned,
    isArchived: row.is_archived,
    isTrashed: row.is_trashed,
    labelIds: row.label_ids ?? [],
  }),
};

import { COLORS } from '@/constants';
import type { DisplayNote, Filters, Label, Note, NoteDto } from '@/types';

export const filterNote = (note: Note, filters: Filters): boolean => {
  const q = filters.search.trim().toLowerCase();
  const matchesSearch =
    q === '' || note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q);

  switch (filters.view.type) {
    case 'notes':
      return !note.isArchived && !note.isTrashed && matchesSearch;
    case 'archive':
      return note.isArchived && !note.isTrashed && matchesSearch;
    case 'trash':
      return note.isTrashed && matchesSearch;
    case 'label':
      return (
        !note.isTrashed &&
        !note.isArchived &&
        note.labelIds.includes(filters.view.id) &&
        matchesSearch
      );
  }
};

export const getColorValue = (colorId: string) =>
  COLORS.find((item) => item.id === colorId)?.value ?? null;

export const mapNoteToDisplay = (note: Note, labels: Record<string, Label>): DisplayNote => {
  const { labelIds = [], colorId, ...rest } = note;
  const noteLabels = labelIds.map((id) => labels[id]);
  const colorValue = getColorValue(colorId);

  return {
    ...rest,
    colorId,
    labels: noteLabels,
    colorValue,
  };
};

export const mapNoteDtosToNotesMap = (notesDto: NoteDto[]): Record<string, Note> => {
  return notesDto.reduce(
    (acc, noteDto) => {
      const { order, createdAt, updatedAt, ...note } = noteDto;
      acc[noteDto.id] = note;
      return acc;
    },
    {} as Record<string, Note>,
  );
};

export const getSortedNoteIds = (notesDto: NoteDto[]): string[] =>
  [...notesDto].sort((a, b) => a.order - b.order).map((n) => n.id);

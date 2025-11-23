import { COLORS } from '@/constants';
import type { DisplayNote, Filters, Label, Note } from '@/types';

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

export const mapNoteToDisplay = (note: Note, labels: Label[]): DisplayNote => {
  const { labelIds, colorId, ...rest } = note;
  const noteLabels = labels.filter((label) => labelIds.includes(label.id));
  const colorValue = getColorValue(colorId);

  return {
    ...rest,
    colorId,
    labels: noteLabels,
    colorValue,
  };
};

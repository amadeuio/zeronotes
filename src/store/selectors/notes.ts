import { useStore } from '@/store';
import { filterNote, mapNoteToDisplay } from '@/utils';
import { useMemo } from 'react';
import { createSelector } from 'reselect';
import {
  selectActiveNote,
  selectFilters,
  selectLabels,
  selectNotes,
  selectNotesOrder,
} from './base';

export const selectFilteredNotes = createSelector([selectNotes, selectFilters], (notes, filters) =>
  notes.filter((n) => filterNote(n, filters)),
);

export const selectNotesDisplay = createSelector(
  [selectFilteredNotes, selectLabels],
  (filteredNotes, labels) => filteredNotes.map((n) => mapNoteToDisplay(n, labels)),
);

export const selectActiveNoteDisplay = createSelector(
  [selectNotes, selectActiveNote, selectLabels],
  (notes, activeNote, labels) => {
    const note = notes.find((n) => n.id === activeNote.id);
    return note ? mapNoteToDisplay(note, labels) : null;
  },
);

export const selectPinnedNotes = createSelector([selectFilteredNotes], (filteredNotes) =>
  filteredNotes.filter((n) => n.isPinned),
);

export const selectUnpinnedNotes = createSelector([selectFilteredNotes], (filteredNotes) =>
  filteredNotes.filter((n) => !n.isPinned),
);

export const selectHasPinnedNotes = createSelector(
  [selectPinnedNotes],
  (pinnedNotes) => pinnedNotes.length > 0,
);

export const selectHasUnpinnedNotes = createSelector(
  [selectUnpinnedNotes],
  (unpinnedNotes) => unpinnedNotes.length > 0,
);

export const selectPinnedOrder = createSelector(
  [selectNotesOrder, selectPinnedNotes],
  (notesOrder, pinnedNotes) => {
    const pinnedIds = new Set(pinnedNotes.map((n) => n.id));
    return notesOrder.filter((id) => pinnedIds.has(id));
  },
);

export const selectUnpinnedOrder = createSelector(
  [selectNotesOrder, selectUnpinnedNotes],
  (notesOrder, unpinnedNotes) => {
    const unpinnedIds = new Set(unpinnedNotes.map((n) => n.id));
    return notesOrder.filter((id) => unpinnedIds.has(id));
  },
);

const selectIsNoteActive = (noteId: string) =>
  createSelector([selectActiveNote], (activeNote) => activeNote.id === noteId);

export const useSelectIsNoteActive = (noteId: string) =>
  useStore(useMemo(() => selectIsNoteActive(noteId), [noteId]));

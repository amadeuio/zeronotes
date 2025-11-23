import { type Store } from '@/store';

export const selectActions = (state: Store) => state.actions;
export const selectFilters = (state: Store) => state.filters;
export const selectFiltersSearch = (state: Store) => state.filters.search;
export const selectFiltersView = (state: Store) => state.filters.view;
export const selectUi = (state: Store) => state.ui;
export const selectNotes = (state: Store) => state.notes;
export const selectNotesOrder = (state: Store) => state.notesOrder;
export const selectNoteHeights = (state: Store) => state.noteHeights;
export const selectActiveNote = (state: Store) => state.activeNote;
export const selectActiveNoteId = (state: Store) => state.activeNote.id;
export const selectActiveNotePosition = (state: Store) => state.activeNote.position;
export const selectLabels = (state: Store) => state.labels;
export const selectGridColumns = (state: Store) => state.ui.gridColumns;

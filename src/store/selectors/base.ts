import { type Store } from '@/store';

export const selectActions = (state: Store) => state.actions;
export const selectFilters = (state: Store) => state.filters;
export const selectFiltersSearch = (state: Store) => state.filters.search;
export const selectFiltersView = (state: Store) => state.filters.view;
export const selectUi = (state: Store) => state.ui;
export const selectNotes = (state: Store) => state.notes.byId;
export const selectNotesOrder = (state: Store) => state.notes.order;
export const selectNoteHeights = (state: Store) => state.notes.heights;
export const selectActiveNote = (state: Store) => state.notes.active;
export const selectActiveNoteId = (state: Store) => state.notes.active.id;
export const selectActiveNotePosition = (state: Store) => state.notes.active.position;
export const selectLabels = (state: Store) => state.labels.byId;
export const selectGridColumns = (state: Store) => state.ui.gridColumns;
export const selectApiStatus = (state: Store) => state.api;

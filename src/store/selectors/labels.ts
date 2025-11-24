import { useStore } from '@/store';
import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { selectLabels, selectNotes } from './base';

export const selectLabelsArray = createSelector([selectLabels], (labels) => Object.values(labels));

const selectNoteHasLabel = (noteId: string, labelId: string) =>
  createSelector([selectNotes], (notes) => notes[noteId]?.labelIds.includes(labelId) ?? false);

export const useSelectNoteHasLabel = (noteId: string, labelId: string) =>
  useStore(useMemo(() => selectNoteHasLabel(noteId, labelId), [noteId, labelId]));

const selectFilteredLabels = (searchTerm: string) => {
  const lower = searchTerm.toLowerCase();
  return createSelector([selectLabelsArray], (labels) =>
    labels.filter((label) => label.name.toLowerCase().includes(lower)),
  );
};

export const useSelectFilteredLabels = (searchTerm: string) =>
  useStore(useMemo(() => selectFilteredLabels(searchTerm), [searchTerm]));
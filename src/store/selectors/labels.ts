import { useStore } from '@/store';
import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { selectLabels, selectNotes } from './base';

const selectNoteHasLabel = (noteId: string, labelId: string) =>
  createSelector(
    [selectNotes],
    (notes) => notes.find((n) => n.id === noteId)?.labelIds.includes(labelId) ?? false,
  );

export const useSelectNoteHasLabel = (noteId: string, labelId: string) =>
  useStore(useMemo(() => selectNoteHasLabel(noteId, labelId), [noteId, labelId]));

const selectFilteredLabels = (searchTerm: string) =>
  createSelector([selectLabels], (labels) =>
    labels.filter((label) => label.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

export const useSelectFilteredLabels = (searchTerm: string) =>
  useStore(useMemo(() => selectFilteredLabels(searchTerm), [searchTerm]));

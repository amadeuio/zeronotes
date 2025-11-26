import { selectActions, useStore } from '@/store';
import {
  getSortedNoteIds,
  mapLabelDtosToLabelsMap,
  mapNoteDtosToNotesMap,
} from '@/utils';
import { useEffect, useState } from 'react';
import { labelsApi, notesApi } from '../api';

export const useFetchApp = () => {
  const actions = useStore(selectActions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      setIsLoading(true);
      try {
        const [notesDto, labelsDto] = await Promise.all([
          notesApi.getAll(),
          labelsApi.getAll(),
        ]);
        const notesMap = mapNoteDtosToNotesMap(notesDto);
        const sortedNoteIds = getSortedNoteIds(notesDto);
        const labelsMap = mapLabelDtosToLabelsMap(labelsDto);

        actions.notes.set(notesMap);
        actions.notesOrder.set(sortedNoteIds);
        actions.labels.set(labelsMap);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApp();
  }, [actions]);

  return isLoading;
};

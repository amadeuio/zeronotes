import { labelsApi, notesApi } from '@/api';
import { selectActions, useStore } from '@/store';
import { getSortedNoteIds, mapLabelDtosToLabelsMap, mapNoteDtosToNotesMap } from '@/utils';
import { useEffect, useState } from 'react';

export const useFetchApp = () => {
  const actions = useStore(selectActions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      setIsLoading(true);
      try {
        const [notesDto, labelsDto] = await Promise.all([notesApi.getAll(), labelsApi.getAll()]);

        actions.notes.set(mapNoteDtosToNotesMap(notesDto));
        actions.notesOrder.set(getSortedNoteIds(notesDto));
        actions.labels.set(mapLabelDtosToLabelsMap(labelsDto));
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

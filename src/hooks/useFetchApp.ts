import { selectActions, useStore } from '@/store';
import { useEffect, useState } from 'react';
import { labelsApi } from '../api/labels';
import { notesApi } from '../api/notes';

export const useFetchApp = () => {
  const actions = useStore(selectActions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      setIsLoading(true);
      try {
        const [notes, labels] = await Promise.all([notesApi.getAll(), labelsApi.getAll()]);

        actions.notes.set(notes);
        actions.notesOrder.set(notes.map((n) => n.id));
        actions.labels.set(labels);
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

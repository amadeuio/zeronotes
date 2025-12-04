import { bootstrapApi } from '@/api';
import { requireDataKey } from '@/crypto';
import { selectActions, useStore } from '@/store';
import { decryptLabels, decryptNotes } from '@/utils';
import { useEffect, useState } from 'react';

export const useBootstrap = () => {
  const actions = useStore(selectActions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBootstrap = async () => {
      setIsLoading(true);
      try {
        const response = await bootstrapApi.get();
        const dataKey = requireDataKey();

        const { notesById, notesOrder } = await decryptNotes(response.notes, dataKey);
        const labelsById = await decryptLabels(response.labels, dataKey);

        actions.notes.set(notesById);
        actions.notesOrder.set(notesOrder);
        actions.labels.set(labelsById);
      } catch (error) {
        console.error('Failed to bootstrap app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBootstrap();
  }, []);

  return isLoading;
};

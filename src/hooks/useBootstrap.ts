import { bootstrapApi } from '@/api';
import { selectActions, useStore } from '@/store';
import { useEffect, useState } from 'react';

export const useBootstrap = () => {
  const actions = useStore(selectActions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBootstrap = async () => {
      setIsLoading(true);
      try {
        const response = await bootstrapApi.get();
        actions.notes.set(response.notesById);
        actions.notesOrder.set(response.notesOrder);
        actions.labels.set(response.labelsById);
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

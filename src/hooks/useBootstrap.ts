import { fetchWithAuth } from '@/api/utils';
import { API_URL } from '@/constants';
import { selectActions, useStore } from '@/store';
import type { Label, Note } from '@/types';
import { useEffect, useState } from 'react';

export interface BootstrapAPI {
  notesById: Record<string, Note>;
  notesOrder: string[];
  labelsById: Record<string, Label>;
}

const getBootstrap = async (): Promise<BootstrapAPI> => {
  const res = await fetchWithAuth(`${API_URL}/bootstrap`);
  const data = await res.json();
  return data;
};

export const useBootstrap = () => {
  const actions = useStore(selectActions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBootstrap = async () => {
      setIsLoading(true);
      try {
        const bootstrap = await getBootstrap();
        actions.notes.set(bootstrap.notesById);
        actions.notesOrder.set(bootstrap.notesOrder);
        actions.labels.set(bootstrap.labelsById);
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

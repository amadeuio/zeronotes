import { bootstrapApi } from '@/api';
import { selectActions, useStore } from '@/store';
import { decryptString, requireDataKey } from '@/utils/crypto';
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

        const decryptedNotesEntries = await Promise.all(
          Object.entries(response.notesById).map(async ([id, note]) => {
            const title = await decryptString(note.title, dataKey);
            const content = await decryptString(note.content, dataKey);
            return [id, { ...note, title, content }] as const;
          }),
        );
        const decryptedNotesById = Object.fromEntries(decryptedNotesEntries);

        const decryptedLabelsEntries = await Promise.all(
          Object.entries(response.labelsById).map(async ([id, label]) => {
            const name = await decryptString(label.name, dataKey);
            return [id, { ...label, name }] as const;
          }),
        );
        const decryptedLabelsById = Object.fromEntries(decryptedLabelsEntries);

        actions.notes.set(decryptedNotesById);
        actions.notesOrder.set(response.notesOrder);
        actions.labels.set(decryptedLabelsById);
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

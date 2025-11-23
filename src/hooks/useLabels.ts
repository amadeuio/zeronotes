import { selectActions, useStore } from '@/store';
import type { Label } from '@/types';
import { labelsApi } from '../api/labels';

export const useLabels = () => {
  const { labels } = useStore(selectActions);

  const createLabel = async (label: Omit<Label, 'id'>) => {
    await labelsApi.create(label);
  };

  const updateLabel = async (id: string, label: Omit<Label, 'id'>) => {
    await labelsApi.update(id, label);
  };

  const deleteLabel = async (id: string) => {
    await labelsApi.delete(id);
  };

  return { labels, createLabel, updateLabel, deleteLabel };
};

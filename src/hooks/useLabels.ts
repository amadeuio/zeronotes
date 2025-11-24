import { labelsApi } from '@/api';
import { selectActions, useStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';

export const useLabels = () => {
  const actions = useStore(selectActions);

  const createLabel = async (name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.labels.create(newLabel);
    await labelsApi.create(newLabel);
  };

  const updateLabel = async (id: string, name: string) => {
    actions.labels.update(id, { name });
    await labelsApi.update(id, { name });
  };

  const deleteLabel = async (id: string) => {
    actions.labels.delete(id);
    await labelsApi.delete(id);
  };

  return { createLabel, updateLabel, deleteLabel };
};

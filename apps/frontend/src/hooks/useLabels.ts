import { labelsApi, withApiStatus } from '@/api';
import { selectActions, useStore } from '@/store';
import type { Label } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useLabels = () => {
  const actions = useStore(selectActions);
  const api = withApiStatus(labelsApi, actions);

  const create = async (name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.labels.create(newLabel);
    await api.create(newLabel);
  };

  const update = async (id: string, name: string) => {
    actions.labels.update(id, { name });
    await api.update(id, { name });
  };

  const remove = async (id: string) => {
    actions.labels.delete(id);
    await api.delete(id);
  };

  const createAndCallAction = async (name: string, action: (label: Label) => void) => {
    const id = uuidv4();
    const newLabel = { id, name };
    action(newLabel);
    actions.labels.create(newLabel);
    await api.create(newLabel);
  };

  return { create, update, remove, createAndCallAction };
};

import { labelsApi } from '@/api';
import { encryptString, requireDataKey } from '@/crypto';
import { selectActions, useStore } from '@/store';
import type { Label } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';

export const useLabels = () => {
  const actions = useStore(selectActions);

  const create = async (name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.labels.create(newLabel);

    const dataKey = requireDataKey();
    const encryptedLabel = {
      id,
      name: await encryptString(name, dataKey),
    };

    await labelsApi.create(encryptedLabel);
  };

  const update = async (id: string, name: string) => {
    actions.labels.update(id, { name });

    const dataKey = requireDataKey();
    const encryptedLabel = {
      name: await encryptString(name, dataKey),
    };

    await labelsApi.update(id, encryptedLabel);
  };

  const remove = async (id: string) => {
    actions.labels.delete(id);
    await labelsApi.delete(id);
  };

  const createAndCallAction = async (name: string, action: (label: Label) => void) => {
    const id = uuidv4();
    const newLabel = { id, name };
    action(newLabel);
    actions.labels.create(newLabel);

    const dataKey = requireDataKey();
    const encryptedLabel = {
      id,
      name: await encryptString(name, dataKey),
    };

    await labelsApi.create(encryptedLabel);
  };

  return { create, update, remove, createAndCallAction };
};

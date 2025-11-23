import { selectActions, selectNotes, useStore } from '@/store';
import { useEffect } from 'react';
import { labelsApi } from '../api/labels';

export const useLabels = () => {
  const actions = useStore(selectActions);
  const notes = useStore(selectNotes);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const labels = await labelsApi.getAll();
      actions.labels.set(labels);
    } catch (error) {
      console.error(error);
    }
  };

  const createLabel = async (name: string) => {
    actions.labels.create({ name });
    await labelsApi.create({ name });
  };

  const createLabelAndAddToNote = async (name: string, noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const newLabel = actions.labels.create({ name });
    actions.notes.update(noteId, { labelIds: [...note.labelIds, newLabel.id] });
    await labelsApi.create({ name });
  };

  const updateLabel = async (id: string, name: string) => {
    actions.labels.update(id, { name });
    await labelsApi.update(id, { name });
  };

  const deleteLabel = async (id: string) => {
    actions.labels.delete(id);
    await labelsApi.delete(id);
  };

  return { createLabel, createLabelAndAddToNote, updateLabel, deleteLabel };
};

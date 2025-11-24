import { labelsApi } from '@/api';
import { selectActions, selectNotes, useStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';

export const useLabels = () => {
  const actions = useStore(selectActions);
  const notes = useStore(selectNotes);

  const createLabel = async (name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.labels.create(newLabel);
    await labelsApi.create(newLabel);
  };

  const createLabelAndAddToNote = async (name: string, noteId: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.labels.create(newLabel);
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    actions.notes.update(noteId, { labelIds: [...note.labelIds, newLabel.id] });
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

  return { createLabel, createLabelAndAddToNote, updateLabel, deleteLabel };
};

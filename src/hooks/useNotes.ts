import { notesApi, withApiStatus } from '@/api';
import { selectActions, useStore } from '@/store';
import type { DraftNote, Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useNotes = () => {
  const actions = useStore(selectActions);
  const api = withApiStatus(notesApi, actions);

  const create = async (note: DraftNote) => {
    const id = uuidv4();
    const newNote = { ...note, id };
    actions.notes.create(newNote);
    await api.create(newNote);
  };

  const update = async (id: string, updates: Partial<Note>) => {
    actions.notes.update(id, updates);
    await api.update(id, updates);
  };

  const remove = async (id: string) => {
    actions.notes.delete(id);
    await api.delete(id);
  };

  const trash = async (id: string) => {
    const updates = { isTrashed: true, isPinned: false, isArchived: false };
    actions.notes.update(id, updates);
    await api.update(id, updates);
  };

  const restore = async (id: string) => {
    const updates = { isTrashed: false };
    actions.notes.update(id, updates);
    await api.update(id, updates);
  };

  const addLabel = async (noteId: string, labelId: string) => {
    actions.notes.addLabel(noteId, labelId);
    await api.addLabel(noteId, labelId);
  };

  const removeLabel = async (noteId: string, labelId: string) => {
    actions.notes.removeLabel(noteId, labelId);
    await api.removeLabel(noteId, labelId);
  };

  const createLabelAndAddToNote = async (noteId: string, name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.notes.createLabelAndAddToNote(noteId, newLabel);
    await api.createLabelAndAddToNote(noteId, newLabel);
  };

  return {
    create,
    update,
    remove,
    trash,
    restore,
    addLabel,
    removeLabel,
    createLabelAndAddToNote,
  };
};

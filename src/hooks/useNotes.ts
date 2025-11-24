import { notesApi } from '@/api';
import { selectActions, useStore } from '@/store';
import type { DraftNote, Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useNotes = () => {
  const actions = useStore(selectActions);

  const create = async (note: DraftNote) => {
    const id = uuidv4();
    const newNote = { ...note, id };
    actions.notes.create(newNote);
    await notesApi.create(newNote);
  };

  const update = async (id: string, updates: Partial<Note>) => {
    actions.notes.update(id, updates);
    await notesApi.update(id, updates);
  };

  const remove = async (id: string) => {
    actions.notes.delete(id);
    await notesApi.delete(id);
  };

  const trash = async (id: string) => {
    actions.notes.update(id, { isTrashed: true, isPinned: false, isArchived: false });
    await notesApi.update(id, { isTrashed: true, isPinned: false, isArchived: false });
  };

  const restore = async (id: string) => {
    actions.notes.update(id, { isTrashed: false });
    await notesApi.update(id, { isTrashed: false });
  };

  const addLabel = async (noteId: string, labelId: string) => {
    actions.notes.addLabel(noteId, labelId);
    await notesApi.addLabel(noteId, labelId);
  };

  const removeLabel = async (noteId: string, labelId: string) => {
    actions.notes.removeLabel(noteId, labelId);
    await notesApi.removeLabel(noteId, labelId);
  };

  const createLabelAndAddToNote = async (noteId: string, name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.notes.createLabelAndAddToNote(noteId, newLabel);
    await notesApi.createLabelAndAddToNote(noteId, newLabel);
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

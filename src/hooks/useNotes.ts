import { notesApi } from '@/api';
import { selectActions, selectNotes, useStore } from '@/store';
import type { DraftNote } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useNotes = () => {
  const actions = useStore(selectActions);
  const notes = useStore(selectNotes);

  const addNote = async (note: DraftNote) => {
    const id = uuidv4();
    const newNote = { ...note, id };
    actions.notes.create(newNote);
    await notesApi.create(newNote);
  };

  const removeNote = async (id: string) => {
    actions.notes.delete(id);
    await notesApi.delete(id);
  };

  const updateTitle = async (id: string, title: string) => {
    actions.notes.update(id, { title });
    await notesApi.update(id, { title });
  };

  const updateContent = async (id: string, content: string) => {
    actions.notes.update(id, { content });
    await notesApi.update(id, { content });
  };

  const updateColor = async (id: string, colorId: string) => {
    actions.notes.update(id, { colorId });
    await notesApi.update(id, { colorId });
  };

  const addLabel = async (noteId: string, labelId: string) => {
    actions.notes.addLabel(noteId, labelId);
    await notesApi.addLabel(noteId, labelId);
  };

  const removeLabel = async (noteId: string, labelId: string) => {
    actions.notes.removeLabel(noteId, labelId);
    await notesApi.removeLabel(noteId, labelId);
  };

  const updateArchived = async (id: string, isArchived: boolean) => {
    actions.notes.update(id, { isArchived });
    await notesApi.update(id, { isArchived });
  };

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const isPinned = !note.isPinned;

    actions.notes.update(id, { isPinned });
    await notesApi.update(id, { isPinned });
  };

  const trashNote = async (id: string) => {
    actions.notes.update(id, { isTrashed: true, isPinned: false, isArchived: false });
    await notesApi.update(id, { isTrashed: true, isPinned: false, isArchived: false });
  };

  const restoreNote = async (id: string) => {
    actions.notes.update(id, { isTrashed: false });
    await notesApi.update(id, { isTrashed: false });
  };

  return {
    addNote,
    removeNote,
    updateTitle,
    updateContent,
    updateColor,
    addLabel,
    removeLabel,
    updateArchived,
    togglePin,
    trashNote,
    restoreNote,
  };
};

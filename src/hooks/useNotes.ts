import { notesApi } from '@/api';
import { selectActions, selectNotes, useStore } from '@/store';
import type { DraftNote } from '@/types';

export const useNotes = () => {
  const actions = useStore(selectActions);
  const notes = useStore(selectNotes);

  const addNote = async (note: DraftNote) => {
    actions.notes.create(note);
    await notesApi.create(note);
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

  const removeLabel = async (noteId: string, labelId: string) => {
    const note = notes.find((n) => n.id === noteId);
    const labelIds = note?.labelIds.filter((id) => id !== labelId) || [];

    actions.notes.update(noteId, { labelIds });
    await notesApi.update(noteId, { labelIds });
  };

  const toggleLabel = async (noteId: string, labelId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const labelIds = note.labelIds.includes(labelId)
      ? note.labelIds.filter((id) => id !== labelId)
      : [...note.labelIds, labelId];

    actions.notes.update(noteId, { labelIds });
    await notesApi.update(noteId, { labelIds });
  };

  const toggleArchive = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const isArchived = !note.isArchived;

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
    removeLabel,
    toggleLabel,
    toggleArchive,
    togglePin,
    trashNote,
    restoreNote,
  };
};

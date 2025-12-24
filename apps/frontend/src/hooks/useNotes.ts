import { notesApi, withApiStatus } from '@/api';
import { encryptString, requireDataKey } from '@/crypto';
import { selectActions, useStore } from '@/store';
import type { DraftNote } from '@/types';
import type { Note } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';

export const useNotes = () => {
  const actions = useStore(selectActions);
  const api = withApiStatus(notesApi, actions);

  const create = async (note: DraftNote) => {
    const id = uuidv4();
    const newNote = { ...note, id };

    actions.notes.create(newNote);

    const dataKey = requireDataKey();
    const encryptedPayload = {
      id,
      title: await encryptString(newNote.title, dataKey),
      content: await encryptString(newNote.content, dataKey),
      colorId: newNote.colorId,
      isPinned: newNote.isPinned,
      isArchived: newNote.isArchived,
      labelIds: newNote.labelIds,
    };

    await api.create(encryptedPayload);
  };

  const update = async (id: string, updates: Partial<Note>) => {
    actions.notes.update(id, updates);
    await api.update(id, updates);
  };

  const updateTitle = async (id: string, title: string) => {
    actions.notes.update(id, { title });

    const dataKey = requireDataKey();
    const encryptedTitle = await encryptString(title, dataKey);
    await api.update(id, { title: encryptedTitle });
  };

  const updateContent = async (id: string, content: string) => {
    actions.notes.update(id, { content });

    const dataKey = requireDataKey();
    const encryptedContent = await encryptString(content, dataKey);
    await api.update(id, { content: encryptedContent });
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

    const dataKey = requireDataKey();
    const encryptedLabel = {
      id,
      name: await encryptString(name, dataKey),
    };

    await api.createLabelAndAddToNote(noteId, encryptedLabel);
  };

  const reorderNotes = async (notesOrder: string[]) => {
    await api.reorderNotes({ noteIds: notesOrder });
  };

  return {
    create,
    update,
    updateTitle,
    updateContent,
    remove,
    trash,
    restore,
    addLabel,
    removeLabel,
    createLabelAndAddToNote,
    reorderNotes,
  };
};

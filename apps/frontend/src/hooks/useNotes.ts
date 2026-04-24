import { notesApi } from '@/api';
import { encryptString, requireDataKey } from '@/crypto';
import { selectActions, useStore } from '@/store';
import type { DraftNote } from '@/types';
import type { Note } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';

const isDemo = () => useStore.getState().auth.isDemo;

export const useNotes = () => {
  const actions = useStore(selectActions);

  const create = async (note: DraftNote) => {
    const id = uuidv4();
    const newNote = { ...note, id };
    actions.notes.create(newNote);
    if (isDemo()) return;

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

    await notesApi.create(encryptedPayload);
  };

  const update = async (id: string, updates: Partial<Note>) => {
    actions.notes.update(id, updates);
    if (isDemo()) return;
    await notesApi.update(id, updates);
  };

  const updateTitle = async (id: string, title: string) => {
    actions.notes.update(id, { title });
    if (isDemo()) return;

    const dataKey = requireDataKey();
    const encryptedTitle = await encryptString(title, dataKey);
    await notesApi.update(id, { title: encryptedTitle });
  };

  const updateContent = async (id: string, content: string) => {
    actions.notes.update(id, { content });
    if (isDemo()) return;

    const dataKey = requireDataKey();
    const encryptedContent = await encryptString(content, dataKey);
    await notesApi.update(id, { content: encryptedContent });
  };

  const remove = async (id: string) => {
    actions.notes.delete(id);
    if (isDemo()) return;
    await notesApi.delete(id);
  };

  const trash = async (id: string) => {
    const updates = { isTrashed: true, isPinned: false, isArchived: false };
    actions.notes.update(id, updates);
    if (isDemo()) return;
    await notesApi.update(id, updates);
  };

  const restore = async (id: string) => {
    const updates = { isTrashed: false };
    actions.notes.update(id, updates);
    if (isDemo()) return;
    await notesApi.update(id, updates);
  };

  const addLabel = async (noteId: string, labelId: string) => {
    actions.notes.addLabel(noteId, labelId);
    if (isDemo()) return;
    await notesApi.addLabel(noteId, labelId);
  };

  const removeLabel = async (noteId: string, labelId: string) => {
    actions.notes.removeLabel(noteId, labelId);
    if (isDemo()) return;
    await notesApi.removeLabel(noteId, labelId);
  };

  const createLabelAndAddToNote = async (noteId: string, name: string) => {
    const id = uuidv4();
    const newLabel = { id, name };
    actions.notes.createLabelAndAddToNote(noteId, newLabel);
    if (isDemo()) return;

    const dataKey = requireDataKey();
    const encryptedLabel = {
      id,
      name: await encryptString(name, dataKey),
    };

    await notesApi.createLabelAndAddToNote(noteId, encryptedLabel);
  };

  const reorderNotes = async (notesOrder: string[]) => {
    if (isDemo()) return;
    await notesApi.reorderNotes({ noteIds: notesOrder });
  };

  const uploadAllFromStore = async () => {
    const allNotes = Object.values(useStore.getState().notes.byId);
    const dataKey = requireDataKey();

    await Promise.all(
      allNotes
        .filter((note) => !note.isTrashed)
        .map(async (note) => {
          const encryptedPayload = {
            id: note.id,
            title: await encryptString(note.title, dataKey),
            content: await encryptString(note.content, dataKey),
            colorId: note.colorId,
            isPinned: note.isPinned,
            isArchived: note.isArchived,
            labelIds: note.labelIds,
          };
          await notesApi.create(encryptedPayload);
        }),
    );
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
    uploadAllFromStore,
  };
};

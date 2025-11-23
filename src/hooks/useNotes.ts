import { selectActions, useStore } from '@/store';
import type { DraftNote, Note } from '@/types';
import { notesApi } from '../api/notes';

export const useNotes = () => {
  const { notes } = useStore(selectActions);

  const createNote = async (note: DraftNote) => {
    await notesApi.create(note);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    await notesApi.update(id, updates);
  };

  const deleteNote = async (id: string) => {
    await notesApi.delete(id);
  };

  return { notes, createNote, updateNote, deleteNote };
};

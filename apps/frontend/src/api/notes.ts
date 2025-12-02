import type {
  AddLabelToNoteParams,
  CreateLabelAndAddToNoteParams,
  CreateLabelBody,
  CreateNoteBody,
  DeleteNoteParams,
  Note,
  RemoveLabelFromNoteParams,
  ReorderNotesBody,
  UpdateNoteBody,
  UpdateNoteParams,
} from '@zeronotes/shared';
import { API_URL } from './constants';
import { fetchWithAuth } from './utils';

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const res = await fetchWithAuth(`${API_URL}/notes`);
    const data = await res.json();
    return data;
  },

  create: async (note: CreateNoteBody): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) {
      throw new Error('Failed to create note');
    }
  },

  update: async (id: UpdateNoteParams['id'], note: UpdateNoteBody): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
  },

  delete: async (id: DeleteNoteParams['id']): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  },

  addLabel: async (
    id: AddLabelToNoteParams['id'],
    labelId: AddLabelToNoteParams['labelId'],
  ): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}/labels/${labelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  },

  removeLabel: async (
    id: RemoveLabelFromNoteParams['id'],
    labelId: RemoveLabelFromNoteParams['labelId'],
  ): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}/labels/${labelId}`, {
      method: 'DELETE',
    });
  },

  createLabelAndAddToNote: async (
    id: CreateLabelAndAddToNoteParams['id'],
    label: CreateLabelBody,
  ): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    });
  },

  reorderNotes: async (body: ReorderNotesBody): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/notes/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error('Failed to reorder notes');
    }
  },
};

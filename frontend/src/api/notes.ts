import type { Label, Note } from '@/types';
import { API_URL } from './constants';
import { fetchWithAuth } from './utils';

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const res = await fetchWithAuth(`${API_URL}/notes`);
    const data = await res.json();
    return data;
  },

  create: async (note: Omit<Note, 'isTrashed'>): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) {
      throw new Error('Failed to create note');
    }
  },

  update: async (id: string, note: Partial<Note>): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  },

  addLabel: async (id: string, labelId: string): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}/labels/${labelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  },

  removeLabel: async (id: string, labelId: string): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}/labels/${labelId}`, {
      method: 'DELETE',
    });
  },

  createLabelAndAddToNote: async (id: string, label: Label): Promise<void> => {
    await fetchWithAuth(`${API_URL}/notes/${id}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    });
  },

  reorderNotes: async (noteIds: string[]): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/notes/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteIds }),
    });
    if (!res.ok) {
      throw new Error('Failed to reorder notes');
    }
  },
};

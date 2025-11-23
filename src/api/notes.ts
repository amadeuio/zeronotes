import { API_URL } from '@/constants';
import type { DraftNote, Note } from '@/types';
import { toCamelCase, toSnakeCase } from './utils';

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const res = await fetch(`${API_URL}/notes`);
    const data = await res.json();
    return toCamelCase(data);
  },

  create: async (note: DraftNote): Promise<Note> => {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(note)),
    });
    const data = await res.json();
    return toCamelCase(data);
  },

  update: async (id: string, note: Partial<Note>): Promise<Note> => {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(note)),
    });
    const data = await res.json();
    return toCamelCase(data);
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  },
};

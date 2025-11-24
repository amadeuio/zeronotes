import { API_URL } from '@/constants';
import type { DraftNote, Label, Note } from '@/types';
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

  addLabel: async (id: string, labelId: string): Promise<any> => {
    const res = await fetch(`${API_URL}/notes/${id}/labels/${labelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return toCamelCase(data);
  },

  removeLabel: async (id: string, labelId: string): Promise<void> => {
    await fetch(`${API_URL}/notes/${id}/labels/${labelId}`, { method: 'DELETE' });
  },

  createLabelAndAddToNote: async (
    id: string,
    label: Label,
  ): Promise<{ label: any; association: any }> => {
    const res = await fetch(`${API_URL}/notes/${id}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(label)),
    });
    const data = await res.json();
    return toCamelCase(data);
  },
};

import { API_URL } from '@/constants';
import type { Label } from '@/types';
import { toCamelCase, toSnakeCase } from './utils';

export const labelsApi = {
  getAll: async (): Promise<Label[]> => {
    const res = await fetch(`${API_URL}/labels`);
    const data = await res.json();
    return toCamelCase(data);
  },

  create: async (label: Omit<Label, 'id'>): Promise<Label> => {
    const res = await fetch(`${API_URL}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(label)),
    });
    const data = await res.json();
    return toCamelCase(data);
  },

  update: async (id: string, label: Omit<Label, 'id'>): Promise<Label> => {
    const res = await fetch(`${API_URL}/labels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(label)),
    });
    const data = await res.json();
    return toCamelCase(data);
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/labels/${id}`, { method: 'DELETE' });
  },
};

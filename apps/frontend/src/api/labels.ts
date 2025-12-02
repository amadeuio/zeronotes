import type {
  CreateLabelBody,
  DeleteLabelParams,
  Label,
  UpdateLabelBody,
  UpdateLabelParams,
} from '@zeronotes/shared';
import { API_URL } from './constants';
import { fetchWithAuth } from './utils';

export const labelsApi = {
  getAll: async (): Promise<Label[]> => {
    const res = await fetchWithAuth(`${API_URL}/labels`);
    const data = await res.json();
    return data;
  },

  create: async (label: CreateLabelBody): Promise<Label> => {
    const res = await fetchWithAuth(`${API_URL}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    });
    const data = await res.json();
    return data;
  },

  update: async (id: UpdateLabelParams['id'], label: UpdateLabelBody): Promise<Label> => {
    const res = await fetchWithAuth(`${API_URL}/labels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    });
    const data = await res.json();
    return data;
  },

  delete: async (id: DeleteLabelParams['id']): Promise<void> => {
    await fetchWithAuth(`${API_URL}/labels/${id}`, { method: 'DELETE' });
  },
};

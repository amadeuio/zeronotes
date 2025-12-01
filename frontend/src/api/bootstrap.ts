import type { Label, Note } from '@/types';
import { API_URL } from './constants';
import { fetchWithAuth } from './utils';

interface BootstrapResponse {
  notesById: Record<string, Note>;
  notesOrder: string[];
  labelsById: Record<string, Label>;
}

export const bootstrapApi = {
  get: async (): Promise<BootstrapResponse> => {
    const res = await fetchWithAuth(`${API_URL}/bootstrap`);
    const data = await res.json();
    return data;
  },
};

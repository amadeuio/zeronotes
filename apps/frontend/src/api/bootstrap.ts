import type { BootstrapData } from '@zeronotes/shared';
import { API_URL } from './constants';
import { fetchWithAuth } from './utils';

export const bootstrapApi = {
  get: async (): Promise<BootstrapData> => {
    const res = await fetchWithAuth(`${API_URL}/bootstrap`);
    const data = await res.json();
    return data;
  },
};

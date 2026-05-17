import { apiAuth } from '@/utils';
import type { SeedContentBody } from '@zeronotes/shared';

export const seedApi = {
  create: (payload: SeedContentBody): Promise<void> =>
    apiAuth('/seed', {
      method: 'POST',
      body: JSON.stringify(payload),
      trackStatus: false,
    }),
};

import type { SeedContentBody } from '@zeronotes/shared';
import { seedRepository } from './seed.repository';

export const seedService = {
  seedContent: async (userId: string, payload: SeedContentBody): Promise<void> => {
    await seedRepository.seedContent(userId, payload.labels, payload.notes);
  },
};

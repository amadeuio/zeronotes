import type { BootstrapData } from '@zeronotes/shared';
import { apiAuth } from './utils';

export const bootstrapApi = {
  get: (): Promise<BootstrapData> => apiAuth<BootstrapData>('/bootstrap'),
};

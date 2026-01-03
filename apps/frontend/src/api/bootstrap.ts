import { apiAuth } from '@/utils';
import type { BootstrapData } from '@zeronotes/shared';

export const bootstrapApi = {
  get: (): Promise<BootstrapData> => apiAuth('/bootstrap'),
};

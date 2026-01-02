import type {
  CreateLabelBody,
  DeleteLabelParams,
  Label,
  UpdateLabelBody,
  UpdateLabelParams,
} from '@zeronotes/shared';
import { apiAuth } from './utils';

export const labelsApi = {
  getAll: (): Promise<Label[]> => apiAuth<Label[]>('/labels'),

  create: (label: CreateLabelBody): Promise<void> =>
    apiAuth<void>('/labels', {
      method: 'POST',
      body: JSON.stringify(label),
    }),

  update: (id: UpdateLabelParams['id'], label: UpdateLabelBody): Promise<void> =>
    apiAuth<void>(`/labels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(label),
    }),

  delete: (id: DeleteLabelParams['id']): Promise<void> =>
    apiAuth<void>(`/labels/${id}`, { method: 'DELETE' }),
};

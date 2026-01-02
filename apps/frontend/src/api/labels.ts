import type {
  CreateLabelBody,
  DeleteLabelParams,
  Label,
  UpdateLabelBody,
  UpdateLabelParams,
} from '@zeronotes/shared';
import { apiAuth } from './utils';

export const labelsApi = {
  getAll: (): Promise<Label[]> => apiAuth('/labels'),

  create: (label: CreateLabelBody): Promise<void> =>
    apiAuth('/labels', {
      method: 'POST',
      body: JSON.stringify(label),
    }),

  update: (id: UpdateLabelParams['id'], label: UpdateLabelBody): Promise<void> =>
    apiAuth(`/labels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(label),
    }),

  delete: (id: DeleteLabelParams['id']): Promise<void> =>
    apiAuth(`/labels/${id}`, { method: 'DELETE' }),
};

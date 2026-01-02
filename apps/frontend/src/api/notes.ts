import type {
  AddLabelToNoteParams,
  CreateLabelAndAddToNoteParams,
  CreateLabelBody,
  CreateNoteBody,
  DeleteNoteParams,
  Note,
  RemoveLabelFromNoteParams,
  ReorderNotesBody,
  UpdateNoteBody,
  UpdateNoteParams,
} from '@zeronotes/shared';
import { apiAuth } from './utils';

export const notesApi = {
  getAll: (): Promise<Note[]> => apiAuth<Note[]>('/notes'),

  create: (note: CreateNoteBody): Promise<void> =>
    apiAuth<void>('/notes', { method: 'POST', body: JSON.stringify(note) }),

  update: (id: UpdateNoteParams['id'], note: UpdateNoteBody): Promise<void> =>
    apiAuth<void>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    }),

  delete: (id: DeleteNoteParams['id']): Promise<void> =>
    apiAuth<void>(`/notes/${id}`, { method: 'DELETE' }),

  addLabel: (
    id: AddLabelToNoteParams['id'],
    labelId: AddLabelToNoteParams['labelId'],
  ): Promise<void> =>
    apiAuth<void>(`/notes/${id}/labels/${labelId}`, {
      method: 'POST',
    }),

  removeLabel: (
    id: RemoveLabelFromNoteParams['id'],
    labelId: RemoveLabelFromNoteParams['labelId'],
  ): Promise<void> =>
    apiAuth<void>(`/notes/${id}/labels/${labelId}`, {
      method: 'DELETE',
    }),

  createLabelAndAddToNote: (
    id: CreateLabelAndAddToNoteParams['id'],
    label: CreateLabelBody,
  ): Promise<void> =>
    apiAuth<void>(`/notes/${id}/labels`, {
      method: 'POST',
      body: JSON.stringify(label),
    }),

  reorderNotes: (body: ReorderNotesBody): Promise<void> =>
    apiAuth<void>('/notes/reorder', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

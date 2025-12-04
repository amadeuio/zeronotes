import { CreateLabelBody, Label, UpdateLabelBody } from '@zeronotes/shared';
import { labelMappers } from './labels.mappers';
import { labelRepository } from './labels.repository';

export const labelService = {
  findAll: async (userId: string): Promise<Label[]> => {
    const rows = await labelRepository.findAll(userId);
    return rows.map(labelMappers.rowToLabel);
  },

  create: async (userId: string, data: CreateLabelBody): Promise<string> => {
    const label = await labelRepository.create(userId, data.id, data.name);
    return label.id;
  },

  update: async (userId: string, id: string, data: UpdateLabelBody): Promise<string | null> => {
    const label = await labelRepository.update(userId, id, data.name);
    return label ? label.id : null;
  },

  delete: async (userId: string, id: string): Promise<boolean> => {
    return await labelRepository.delete(userId, id);
  },
};

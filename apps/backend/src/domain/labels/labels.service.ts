import { CreateLabelBody, Label, UpdateLabelBody } from '@zeronotes/shared';
import { labelMappers } from './labels.mappers';
import { labelRepository } from './labels.repository';

export const labelService = {
  findAll: async (userId: string): Promise<Record<string, Label>> => {
    const labels = await labelRepository.findAll(userId);
    const labelsById = labels.reduce(
      (acc, label) => {
        acc[label.id] = labelMappers.rowToLabel(label);
        return acc;
      },
      {} as Record<string, Label>,
    );
    return labelsById;
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

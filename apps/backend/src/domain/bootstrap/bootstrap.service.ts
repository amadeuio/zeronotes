import { BootstrapData } from '@zeronotes/shared';
import { labelService } from '../labels/labels.service';
import { noteService } from '../notes/notes.service';

export const bootstrapService = {
  findAll: async (userId: string): Promise<BootstrapData> => {
    const [notes, labelsById] = await Promise.all([
      noteService.findAll(userId),
      labelService.findAll(userId),
    ]);

    return {
      notesById: notes.notesById,
      notesOrder: notes.notesOrder,
      labelsById: labelsById,
    };
  },
};

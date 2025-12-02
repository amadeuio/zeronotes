import { labelService } from '../labels/labels.service';
import { noteService } from '../notes/notes.service';
import { BootstrapData } from './bootstrap.schemas';

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

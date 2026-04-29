import type { Store } from '@/store';
import { labels } from './labels';
import { notes } from './notes';

export const loadDemoIntoStore = (actions: Store['actions']) => {
  const notesById = notes.reduce(
    (acc, note) => {
      acc[note.id] = note;
      return acc;
    },
    {} as Record<string, (typeof notes)[0]>,
  );
  const labelsById = labels.reduce(
    (acc, label) => {
      acc[label.id] = label;
      return acc;
    },
    {} as Record<string, (typeof labels)[0]>,
  );

  actions.ui.setIsDemo(true);
  actions.notes.set(notesById);
  actions.notesOrder.set(notes.map((n) => n.id));
  actions.labels.set(labelsById);
};

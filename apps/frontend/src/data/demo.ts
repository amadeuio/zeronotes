import type { Label, Note } from '@zeronotes/shared';
import { v5 as uuidv5 } from 'uuid';
import { labels } from './labels';
import { notes } from './notes';

// Good. but why this weird namespace? why not just normal UUIDs?

const DEMO_UUID_NAMESPACE = '0f7d8d25-5c6c-4b8f-8d45-5d9f96705b6e';

const stableUuidFromPlaceholderId = (scope: 'label' | 'note', placeholderId: string) =>
  uuidv5(`${scope}:${placeholderId}`, DEMO_UUID_NAMESPACE);

export const getDemoBootstrapData = () => {
  const labelIdByPlaceholderId: Record<string, string> = Object.fromEntries(
    labels.map((label) => [label.id, stableUuidFromPlaceholderId('label', label.id)] as const),
  );

  const labelsById: Record<string, Label> = Object.fromEntries(
    labels.map((label) => {
      const id = labelIdByPlaceholderId[label.id];
      return [id, { ...label, id }] as const;
    }),
  );

  const notesList: Note[] = notes.map((note) => {
    const id = stableUuidFromPlaceholderId('note', note.id);
    const labelIds = note.labelIds.map((placeholderLabelId) => {
      const mappedId = labelIdByPlaceholderId[placeholderLabelId];
      if (!mappedId) {
        throw new Error(`Unknown demo label id: ${placeholderLabelId}`);
      }
      return mappedId;
    });

    return { ...note, id, labelIds };
  });

  const notesById: Record<string, Note> = Object.fromEntries(
    notesList.map((note) => [note.id, note]),
  );
  const notesOrder = notesList.map((note) => note.id);

  return { labelsById, notesById, notesOrder };
};

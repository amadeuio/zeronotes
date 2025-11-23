import { labels as initialLabels, notes as initialNotes } from '@/data';
import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from './store';

beforeEach(() => {
  useStore.setState({
    notes: initialNotes,
    notesOrder: initialNotes.map((n) => n.id),
    noteHeights: {},
    activeNote: { id: null, position: null },
    labels: initialLabels,
    filters: { search: '', view: { type: 'notes' } },
    ui: {
      isEditLabelsMenuOpen: false,
      isSidebarCollapsed: false,
      gridColumns: 5,
    },
  });
});

describe('notesOrder.update', () => {
  it('should move a note to a new position in the order', () => {
    const store = useStore.getState();
    const initialOrder = [...store.notesOrder];

    const noteId = initialOrder[0];
    const overId = initialOrder[2];

    useStore.getState().actions.notesOrder.update(noteId, overId);

    const newOrder = useStore.getState().notesOrder;
    expect(newOrder[2]).toBe(noteId);
    expect(newOrder.length).toBe(initialOrder.length);
  });

  it('should handle moving a note to the end', () => {
    const store = useStore.getState();
    const initialOrder = [...store.notesOrder];
    const lastIndex = initialOrder.length - 1;

    const noteId = initialOrder[0];
    const overId = initialOrder[lastIndex];

    useStore.getState().actions.notesOrder.update(noteId, overId);

    const newOrder = useStore.getState().notesOrder;
    expect(newOrder[lastIndex]).toBe(noteId);
  });

  it('should maintain all note IDs in the order after update', () => {
    const store = useStore.getState();
    const initialOrder = [...store.notesOrder];
    const initialSet = new Set(initialOrder);

    const noteId = initialOrder[1];
    const overId = initialOrder[4];

    useStore.getState().actions.notesOrder.update(noteId, overId);

    const newOrder = useStore.getState().notesOrder;
    const newSet = new Set(newOrder);

    expect(newSet.size).toBe(initialSet.size);
    expect([...initialSet].every((id) => newSet.has(id))).toBe(true);
  });
});

describe('notes.toggleLabel', () => {
  it('should add a label to a note that does not have it', () => {
    const store = useStore.getState();
    const note = store.notes.find((n) => n.id === '1');
    expect(note?.labelIds).toEqual([]);

    const labelId = '1';
    useStore.getState().actions.notes.toggleLabel('1', labelId);

    const updatedNote = useStore.getState().notes.find((n) => n.id === '1');
    expect(updatedNote?.labelIds).toContain(labelId);
    expect(updatedNote?.labelIds.length).toBe(1);
  });

  it('should remove a label from a note that has it', () => {
    const store = useStore.getState();
    const note = store.notes.find((n) => n.id === '3');
    expect(note?.labelIds).toContain('1');

    const labelId = '1';
    useStore.getState().actions.notes.toggleLabel('3', labelId);

    const updatedNote = useStore.getState().notes.find((n) => n.id === '3');
    expect(updatedNote?.labelIds).not.toContain(labelId);
  });

  it('should not affect other notes when toggling a label', () => {
    const store = useStore.getState();
    const noteId = '1';
    const labelId = '2';
    const otherNoteId = '2';

    const otherNoteBefore = store.notes.find((n) => n.id === otherNoteId);
    const otherNoteLabelIdsBefore = [...(otherNoteBefore?.labelIds || [])];

    useStore.getState().actions.notes.toggleLabel(noteId, labelId);

    const otherNoteAfter = useStore.getState().notes.find((n) => n.id === otherNoteId);
    expect(otherNoteAfter?.labelIds).toEqual(otherNoteLabelIdsBefore);
  });
});

describe('labels.createAndAddToNote', () => {
  it('should create a new label and add it to the specified note', () => {
    const store = useStore.getState();
    const noteId = '1';
    const labelName = 'New Label';
    const initialLabelCount = store.labels.length;
    const note = store.notes.find((n) => n.id === noteId);
    const initialLabelIdsCount = note?.labelIds.length || 0;

    useStore.getState().actions.labels.createAndAddToNote(labelName, noteId);

    const updatedStore = useStore.getState();
    const newLabel = updatedStore.labels.find((l) => l.name === labelName);
    expect(newLabel).toBeDefined();
    expect(newLabel?.name).toBe(labelName);
    expect(updatedStore.labels.length).toBe(initialLabelCount + 1);

    const updatedNote = updatedStore.notes.find((n) => n.id === noteId);
    expect(updatedNote?.labelIds).toContain(newLabel?.id);
    expect(updatedNote?.labelIds.length).toBe(initialLabelIdsCount + 1);
  });

  it('should not affect other notes when creating and adding a label', () => {
    const store = useStore.getState();
    const noteId = '1';
    const otherNoteId = '2';
    const labelName = 'Another New Label';

    const otherNoteBefore = store.notes.find((n) => n.id === otherNoteId);
    const otherNoteLabelIdsBefore = [...(otherNoteBefore?.labelIds || [])];

    useStore.getState().actions.labels.createAndAddToNote(labelName, noteId);

    const otherNoteAfter = useStore.getState().notes.find((n) => n.id === otherNoteId);
    expect(otherNoteAfter?.labelIds).toEqual(otherNoteLabelIdsBefore);
  });
});

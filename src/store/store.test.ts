import { labels as initialLabels, notes as initialNotes } from '@/data';
import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from './store';

beforeEach(() => {
  const notesMap = initialNotes.reduce(
    (acc, note) => {
      acc[note.id] = note;
      return acc;
    },
    {} as Record<string, (typeof initialNotes)[0]>,
  );
  const labelsMap = initialLabels.reduce(
    (acc, label) => {
      acc[label.id] = label;
      return acc;
    },
    {} as Record<string, (typeof initialLabels)[0]>,
  );

  useStore.setState({
    notes: notesMap,
    notesOrder: initialNotes.map((n) => n.id),
    noteHeights: {},
    activeNote: { id: null, position: null },
    labels: labelsMap,
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

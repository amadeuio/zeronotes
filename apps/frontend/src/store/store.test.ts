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
    notes: {
      byId: notesMap,
      order: initialNotes.map((n) => n.id),
      heights: {},
      active: { id: null, position: null },
    },
    labels: {
      byId: labelsMap,
    },
    filters: { search: '', view: { type: 'notes' } },
    ui: {
      isEditLabelsMenuOpen: false,
      isSidebarCollapsed: false,
      gridColumns: 5,
    },
    api: { loading: false, error: false },
  });
});

describe('notesOrder.swap', () => {
  it('should move a note to a new position in the order', () => {
    const store = useStore.getState();
    const initialOrder = [...store.notes.order];

    const noteId = initialOrder[0];
    const overId = initialOrder[2];

    useStore.getState().actions.notesOrder.swap(noteId, overId);

    const newOrder = useStore.getState().notes.order;
    expect(newOrder[2]).toBe(noteId);
    expect(newOrder.length).toBe(initialOrder.length);
  });

  it('should handle moving a note to the end', () => {
    const store = useStore.getState();
    const initialOrder = [...store.notes.order];
    const lastIndex = initialOrder.length - 1;

    const noteId = initialOrder[0];
    const overId = initialOrder[lastIndex];

    useStore.getState().actions.notesOrder.swap(noteId, overId);

    const newOrder = useStore.getState().notes.order;
    expect(newOrder[lastIndex]).toBe(noteId);
  });

  it('should maintain all note IDs in the order after update', () => {
    const store = useStore.getState();
    const initialOrder = [...store.notes.order];
    const initialSet = new Set(initialOrder);

    const noteId = initialOrder[1];
    const overId = initialOrder[4];

    useStore.getState().actions.notesOrder.swap(noteId, overId);

    const newOrder = useStore.getState().notes.order;
    const newSet = new Set(newOrder);

    expect(newSet.size).toBe(initialSet.size);
    expect([...initialSet].every((id) => newSet.has(id))).toBe(true);
  });
});

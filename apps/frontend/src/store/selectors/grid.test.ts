import type { Note } from '@/types';
import { describe, expect, it } from 'vitest';
import type { Store } from '../store';
import { selectNoteIdFromPosition, selectPositionFromNoteId, selectTotalHeight } from './grid';

const createNote = (overrides?: Partial<Note>): Note => ({
  id: '1',
  title: 'Test Note',
  content: 'Test content',
  colorId: 'default',
  labelIds: [],
  isPinned: false,
  isArchived: false,
  isTrashed: false,
  ...overrides,
});

const createStore = (overrides?: Partial<Store> & { gridColumns?: number }): Store => {
  const gridColumns = overrides?.gridColumns ?? 2;
  const { gridColumns: _, ...restOverrides } = overrides ?? {};
  return {
    notes: {
      byId: {},
      order: [],
      heights: {},
      active: { id: null, position: null },
    },
    labels: {
      byId: {},
    },
    filters: { search: '', view: { type: 'notes' } },
    ui: {
      isEditLabelsMenuOpen: false,
      isSidebarCollapsed: false,
      gridColumns,
    },
    api: { loading: false, error: false },
    auth: {
      isAuthenticated: false,
      user: null,
      token: null,
    },
    actions: {} as Store['actions'],
    ...restOverrides,
  };
};

describe('selectNoteIdFromPosition', () => {
  it('should find note in pinned section', () => {
    const store = createStore({
      notes: {
        byId: { '1': createNote({ id: '1', isPinned: true }) },
        order: ['1'],
        heights: { '1': 100 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectNoteIdFromPosition(store);
    expect(selector(10, 10)).toBe('1');
  });

  it('should find note in unpinned section', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: false }),
          '4': createNote({ id: '4', isPinned: false }),
        },
        order: ['1', '2', '3', '4'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectNoteIdFromPosition(store);
    expect(selector(260, 234)).toBe('4');
  });

  it('should return undefined when clicking outside notes (in gap or outside grid)', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: false }),
          '4': createNote({ id: '4', isPinned: false }),
        },
        order: ['1', '2', '3', '4'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectNoteIdFromPosition(store);
    expect(selector(10, 120)).toBeUndefined();
    expect(selector(1000, 10)).toBeUndefined();
    expect(selector(10, -100)).toBeUndefined();
  });

  it('should find note with non-linear notesOrder', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: true }),
          '4': createNote({ id: '4', isPinned: true }),
        },
        order: ['3', '1', '4', '2'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectNoteIdFromPosition(store);
    expect(selector(10, 10)).toBe('3');
    expect(selector(254, 10)).toBe('1');
    expect(selector(10, 216)).toBe('4');
    expect(selector(254, 150)).toBe('2');
  });
});

describe('selectPositionFromNoteId', () => {
  it('should return position for pinned note', () => {
    const store = createStore({
      notes: {
        byId: { '1': createNote({ id: '1', isPinned: true }) },
        order: ['1'],
        heights: { '1': 100 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectPositionFromNoteId('1', true)(store);
    expect(selector).toEqual({ x: 0, y: 0 });
  });

  it('should return position for unpinned note with pinned notes in the grid', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: false }),
          '4': createNote({ id: '4', isPinned: false }),
        },
        order: ['1', '2', '3', '4'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectPositionFromNoteId('4', false)(store);
    expect(selector).toEqual({ x: 254, y: 234 });
  });

  it('should return position for unpinned note when there are no pinned notes', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: false }),
          '2': createNote({ id: '2', isPinned: false }),
          '3': createNote({ id: '3', isPinned: false }),
        },
        order: ['1', '2', '3'],
        heights: { '1': 100, '2': 150, '3': 200 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector = selectPositionFromNoteId('3', false)(store);
    expect(selector).toEqual({ x: 0, y: 116 });
  });

  it('should return position for note in single column layout', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: false }),
          '3': createNote({ id: '3', isPinned: false }),
        },
        order: ['1', '2', '3'],
        heights: { '1': 100, '2': 150, '3': 200 },
        active: { id: null, position: null },
      },
      gridColumns: 1,
    });

    const selectorPinned = selectPositionFromNoteId('1', true)(store);
    expect(selectorPinned).toEqual({ x: 0, y: 0 });

    const selectorUnpinned = selectPositionFromNoteId('3', false)(store);
    expect(selectorUnpinned).toEqual({ x: 0, y: 350 });
  });

  it('should return position for note with non-linear notesOrder', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: true }),
          '4': createNote({ id: '4', isPinned: true }),
        },
        order: ['3', '1', '4', '2'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    const selector1 = selectPositionFromNoteId('1', true)(store);
    expect(selector1).toEqual({ x: 254, y: 0 });

    const selector3 = selectPositionFromNoteId('3', true)(store);
    expect(selector3).toEqual({ x: 0, y: 0 });

    const selector4 = selectPositionFromNoteId('4', true)(store);
    expect(selector4).toEqual({ x: 0, y: 216 });

    const selector2 = selectPositionFromNoteId('2', true)(store);
    expect(selector2).toEqual({ x: 254, y: 116 });
  });
});

describe('selectTotalHeight', () => {
  it('should return sum of pinned and unpinned heights', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: false }),
          '4': createNote({ id: '4', isPinned: false }),
        },
        order: ['1', '2', '3', '4'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    expect(selectTotalHeight(store)).toBe(484);
  });

  it('should return unpinned height when there are no pinned notes', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: false }),
          '2': createNote({ id: '2', isPinned: false }),
          '3': createNote({ id: '3', isPinned: false }),
          '4': createNote({ id: '4', isPinned: false }),
        },
        order: ['1', '2', '3', '4'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    expect(selectTotalHeight(store)).toBe(416);
  });

  it('should return 0 when there are no notes', () => {
    const store = createStore({
      notes: {
        byId: {},
        order: [],
        heights: {},
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    expect(selectTotalHeight(store)).toBe(0);
  });

  it('should work correctly with single column layout', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: false }),
          '3': createNote({ id: '3', isPinned: false }),
        },
        order: ['1', '2', '3'],
        heights: { '1': 100, '2': 150, '3': 200 },
        active: { id: null, position: null },
      },
      gridColumns: 1,
    });

    expect(selectTotalHeight(store)).toBe(550);
  });

  it('should calculate height correctly with non-linear notesOrder', () => {
    const store = createStore({
      notes: {
        byId: {
          '1': createNote({ id: '1', isPinned: true }),
          '2': createNote({ id: '2', isPinned: true }),
          '3': createNote({ id: '3', isPinned: true }),
          '4': createNote({ id: '4', isPinned: true }),
        },
        order: ['3', '1', '4', '2'],
        heights: { '1': 100, '2': 150, '3': 200, '4': 250 },
        active: { id: null, position: null },
      },
      gridColumns: 2,
    });

    expect(selectTotalHeight(store)).toBe(550);
  });
});

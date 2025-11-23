  import { labels as initialLabels, notes as initialNotes } from '@/data';
import type { DraftNote, Filters, Label, Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Store {
  notes: Note[];
  notesOrder: string[];
  noteHeights: Record<string, number | null>;
  activeNote: {
    id: string | null;
    position: { top: number; left: number } | null;
  };
  labels: Label[];
  filters: Filters;
  ui: {
    isEditLabelsMenuOpen: boolean;
    isSidebarCollapsed: boolean;
    gridColumns: number;
  };
  actions: {
    notes: {
      create: (note: DraftNote) => void;
      update: (id: string, note: Partial<Note>) => void;
      delete: (id: string) => void;
    };
    notesOrder: {
      update: (noteId: string, overId: string) => void;
    };
    noteHeights: {
      update: (id: string, height: number | null) => void;
    };
    activeNote: {
      set: (activeNote: {
        id: string | null;
        position: { top: number; left: number } | null;
      }) => void;
    };
    labels: {
      create: (label: Omit<Label, 'id'>) => Label;
      update: (id: string, label: Omit<Label, 'id'>) => void;
      delete: (id: string) => void;
    };
    filters: {
      set: (filters: Partial<Filters>) => void;
    };
    ui: {
      setEditLabelsMenuOpen: (isOpen: boolean) => void;
      toggleSidebar: () => void;
      closeSidebar: () => void;
      setGridColumns: (columns: number) => void;
    };
  };
}

export const useStore = create<Store>()(
  devtools((set) => ({
    notes: initialNotes,
    notesOrder: initialNotes.map((n: Note) => n.id),
    noteHeights: {},
    activeNote: {
      id: null,
      position: null,
    },
    labels: initialLabels,
    filters: {
      search: '',
      view: { type: 'notes' },
    },
    ui: {
      isEditLabelsMenuOpen: false,
      isSidebarCollapsed: false,
      gridColumns: 5,
    },
    actions: {
      notes: {
        create: (note) => {
          const { labels, ...rest } = note;
          const newId = uuidv4();
          set((state) => ({
            notes: [
              {
                id: newId,
                ...rest,
                labelIds: labels.map((l) => l.id),
                isTrashed: false,
              },
              ...state.notes,
            ],
            notesOrder: [newId, ...state.notesOrder],
            noteHeights: { ...state.noteHeights, [newId]: null },
          }));
        },
        update: (id, note) => {
          set((state) => ({
            notes: state.notes.map((n) => (n.id === id ? { ...n, ...note } : n)),
          }));
        },
        delete: (id) => {
          set((state) => {
            const { [id]: _, ...restHeights } = state.noteHeights;
            return {
              notes: state.notes.filter((note) => note.id !== id),
              notesOrder: state.notesOrder.filter((noteId) => noteId !== id),
              noteHeights: restHeights,
              activeNote:
                state.activeNote.id === id ? { id: null, position: null } : state.activeNote,
            };
          });
        },
      },
      notesOrder: {
        update: (noteId, overId) => {
          set((state) => {
            const newOrder = [...state.notesOrder];
            const fromIndex = newOrder.indexOf(noteId);
            const toIndex = newOrder.indexOf(overId);

            if (fromIndex === -1 || toIndex === -1) {
              return state;
            }

            newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, noteId);
            return { notesOrder: newOrder };
          });
        },
      },
      noteHeights: {
        update: (id, height) => {
          set((state) => {
            if (state.noteHeights[id] === height) return state;
            return { noteHeights: { ...state.noteHeights, [id]: height } };
          });
        },
      },
      activeNote: {
        set: (activeNote) => {
          set({ activeNote });
        },
      },
      labels: {
        create: (label) => {
          const newId = uuidv4();
          const newLabel = { id: newId, ...label };
          set((state) => ({ labels: [...state.labels, newLabel] }));
          return newLabel;
        },
        update: (id, label) => {
          set((state) => ({
            labels: state.labels.map((l) => (l.id === id ? { ...l, ...label } : l)),
          }));
        },
        delete: (id) => {
          set((state) => ({
            notes: state.notes.map((note) => ({
              ...note,
              labelIds: note.labelIds.filter((labelId) => labelId !== id),
            })),
            labels: state.labels.filter((label) => label.id !== id),
          }));
        },
      },
      filters: {
        set: (filters) => {
          set((state) => ({ filters: { ...state.filters, ...filters } }));
        },
      },
      ui: {
        setEditLabelsMenuOpen: (isOpen) => {
          set((state) => ({ ui: { ...state.ui, isEditLabelsMenuOpen: isOpen } }));
        },
        toggleSidebar: () => {
          set((state) => ({
            ui: { ...state.ui, isSidebarCollapsed: !state.ui.isSidebarCollapsed },
          }));
        },
        closeSidebar: () => {
          set((state) => ({
            ui: { ...state.ui, isSidebarCollapsed: true },
          }));
        },
        setGridColumns: (columns) => {
          set((state) => ({ ui: { ...state.ui, gridColumns: columns } }));
        },
      },
    },
  })),
);

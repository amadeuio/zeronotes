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
      add: (note: DraftNote) => void;
      remove: (id: string) => void;
      updateTitle: (id: string, title: string) => void;
      updateContent: (id: string, content: string) => void;
      updateColor: (id: string, colorId: string) => void;
      removeLabel: (noteId: string, labelId: string) => void;
      toggleLabel: (noteId: string, labelId: string) => void;
      toggleArchive: (id: string) => void;
      togglePin: (id: string) => void;
      trash: (id: string) => void;
      restore: (id: string) => void;
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
      create: (name: string) => Label;
      createAndAddToNote: (name: string, noteId: string) => void;
      edit: (id: string, newName: string) => void;
      remove: (id: string) => void;
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
        add: (note) => {
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
        remove: (id) => {
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
        updateTitle: (id, title) => {
          set((state) => ({
            notes: state.notes.map((note) => (note.id === id ? { ...note, title } : note)),
          }));
        },
        updateContent: (id, content) => {
          set((state) => ({
            notes: state.notes.map((note) => (note.id === id ? { ...note, content } : note)),
          }));
        },
        updateColor: (id, colorId) => {
          set((state) => ({
            notes: state.notes.map((note) => (note.id === id ? { ...note, colorId } : note)),
          }));
        },
        removeLabel: (noteId, labelId) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === noteId
                ? { ...note, labelIds: note.labelIds.filter((l) => l !== labelId) }
                : note,
            ),
          }));
        },
        toggleLabel: (noteId, labelId) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === noteId
                ? {
                    ...note,
                    labelIds: note.labelIds.includes(labelId)
                      ? note.labelIds.filter((l) => l !== labelId)
                      : [...note.labelIds, labelId],
                  }
                : note,
            ),
          }));
        },
        toggleArchive: (id) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? { ...note, isArchived: !note.isArchived } : note,
            ),
            activeNote:
              state.activeNote.id === id ? { id: null, position: null } : state.activeNote,
          }));
        },
        togglePin: (id) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? { ...note, isPinned: !note.isPinned } : note,
            ),
          }));
        },
        trash: (id) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id
                ? { ...note, isTrashed: true, isPinned: false, isArchived: false }
                : note,
            ),
            activeNote:
              state.activeNote.id === id ? { id: null, position: null } : state.activeNote,
          }));
        },
        restore: (id) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? { ...note, isTrashed: false } : note,
            ),
          }));
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
        create: (name: string) => {
          const newId = uuidv4();
          const newLabel = { id: newId, name };
          set((state) => ({ labels: [...state.labels, newLabel] }));
          return newLabel;
        },
        createAndAddToNote: (name, noteId) => {
          set((state) => {
            const newId = uuidv4();
            return {
              notes: state.notes.map((note) =>
                note.id === noteId ? { ...note, labelIds: [...note.labelIds, newId] } : note,
              ),
              labels: [...state.labels, { id: newId, name }],
            };
          });
        },
        edit: (id, newName) => {
          set((state) => ({
            labels: state.labels.map((label) =>
              label.id === id ? { ...label, name: newName } : label,
            ),
          }));
        },
        remove: (id) => {
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

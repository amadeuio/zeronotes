import type { DraftNote, Filters, Label, Note } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Store {
  notes: Record<string, Note>;
  notesOrder: string[];
  noteHeights: Record<string, number | null>;
  activeNote: {
    id: string | null;
    position: { top: number; left: number } | null;
  };
  labels: Record<string, Label>;
  filters: Filters;
  ui: {
    isEditLabelsMenuOpen: boolean;
    isSidebarCollapsed: boolean;
    gridColumns: number;
  };
  apiStatus: {
    loading: boolean;
    error: boolean;
  };
  actions: {
    notes: {
      set: (notes: Note[]) => void;
      create: (note: DraftNote & { id: string }) => void;
      update: (id: string, note: Partial<Note>) => void;
      delete: (id: string) => void;
      addLabel: (noteId: string, labelId: string) => void;
      removeLabel: (noteId: string, labelId: string) => void;
      createLabelAndAddToNote: (noteId: string, label: Label) => void;
    };
    notesOrder: {
      set: (notesOrder: string[]) => void;
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
      set: (labels: Label[]) => void;
      create: (label: Label) => void;
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
    apiStatus: {
      set: (status: Partial<Store['apiStatus']>) => void;
    };
  };
}

export const useStore = create<Store>()(
  devtools((set) => ({
    notes: {},
    notesOrder: [],
    noteHeights: {},
    activeNote: { id: null, position: null },
    labels: {},
    filters: { search: '', view: { type: 'notes' } },
    ui: { isEditLabelsMenuOpen: false, isSidebarCollapsed: false, gridColumns: 5 },
    apiStatus: { loading: false, error: false },
    actions: {
      notes: {
        set: (notes) => {
          const notesMap = notes.reduce(
            (acc, note) => {
              acc[note.id] = note;
              return acc;
            },
            {} as Record<string, Note>,
          );
          set({ notes: notesMap });
        },
        create: (note) => {
          const { labels, ...rest } = note;
          set((state) => ({
            notes: {
              [note.id]: {
                ...rest,
                labelIds: labels.map((l) => l.id),
                isTrashed: false,
              },
              ...state.notes,
            },
            notesOrder: [note.id, ...state.notesOrder],
          }));
        },
        update: (id, note) => {
          set((state) => {
            const existingNote = state.notes[id];
            if (!existingNote) return state;
            return {
              notes: {
                ...state.notes,
                [id]: { ...existingNote, ...note },
              },
            };
          });
        },
        delete: (id) => {
          set((state) => {
            const { [id]: deleted, ...remainingNotes } = state.notes;
            return {
              notes: remainingNotes,
              notesOrder: state.notesOrder.filter((noteId) => noteId !== id),
            };
          });
        },
        addLabel: (noteId, labelId) => {
          set((state) => {
            const note = state.notes[noteId];
            if (!note) return state;
            return {
              notes: {
                ...state.notes,
                [noteId]: { ...note, labelIds: [...note.labelIds, labelId] },
              },
            };
          });
        },
        removeLabel: (noteId, labelId) => {
          set((state) => {
            const note = state.notes[noteId];
            if (!note) return state;
            return {
              notes: {
                ...state.notes,
                [noteId]: { ...note, labelIds: note.labelIds.filter((id) => id !== labelId) },
              },
            };
          });
        },
        createLabelAndAddToNote: (noteId, label) => {
          set((state) => {
            const note = state.notes[noteId];
            if (!note) return state;
            return {
              labels: {
                [label.id]: label,
                ...state.labels,
              },
              notes: {
                ...state.notes,
                [noteId]: { ...note, labelIds: [...note.labelIds, label.id] },
              },
            };
          });
        },
      },
      notesOrder: {
        set: (notesOrder) => {
          set({ notesOrder });
        },
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
        set: (labels) => {
          const labelsMap = labels.reduce(
            (acc, label) => {
              acc[label.id] = label;
              return acc;
            },
            {} as Record<string, Label>,
          );
          set({ labels: labelsMap });
        },
        create: (label) => {
          set((state) => ({
            labels: {
              [label.id]: label,
              ...state.labels,
            },
          }));
        },
        update: (id, label) => {
          set((state) => {
            const existingLabel = state.labels[id];
            if (!existingLabel) return state;
            return {
              labels: {
                ...state.labels,
                [id]: { ...existingLabel, ...label },
              },
            };
          });
        },
        delete: (id) => {
          set((state) => {
            const { [id]: deleted, ...remainingLabels } = state.labels;
            const updatedNotes = Object.fromEntries(
              Object.entries(state.notes).map(([noteId, note]) => [
                noteId,
                {
                  ...note,
                  labelIds: note.labelIds.filter((labelId) => labelId !== id),
                },
              ]),
            );
            return {
              notes: updatedNotes,
              labels: remainingLabels,
            };
          });
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
      apiStatus: {
        set: (status) => {
          set((state) => ({ apiStatus: { ...state.apiStatus, ...status } }));
        },
      },
    },
  })),
);

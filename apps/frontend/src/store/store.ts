import type { Filters } from '@/types';
import type { Encryption, Label, Note, User } from '@zeronotes/shared';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Store {
  notes: {
    byId: Record<string, Note>;
    order: string[];
    heights: Record<string, number | null>;
    active: {
      id: string | null;
      position: { top: number; left: number } | null;
    };
  };
  labels: {
    byId: Record<string, Label>;
  };
  filters: Filters;
  ui: {
    isEditLabelsMenuOpen: boolean;
    isSidebarCollapsed: boolean;
    gridColumns: number;
  };
  api: {
    loading: boolean;
    error: boolean;
  };
  auth: {
    isAuthenticated: boolean;
    isUnlocked: boolean;
    user: User | null;
    token: string | null;
    encryption: Encryption | null;
  };
  actions: {
    notes: {
      set: (notesMap: Record<string, Note>) => void;
      create: (note: Omit<Note, 'isTrashed'>) => void;
      update: (id: string, note: Partial<Note>) => void;
      delete: (id: string) => void;
      addLabel: (noteId: string, labelId: string) => void;
      removeLabel: (noteId: string, labelId: string) => void;
      createLabelAndAddToNote: (noteId: string, label: Label) => void;
    };
    notesOrder: {
      set: (notesOrder: string[]) => void;
      swap: (noteId: string, overId: string) => void;
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
      set: (labelsMap: Record<string, Label>) => void;
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
    api: {
      set: (status: Partial<Store['api']>) => void;
    };
    auth: {
      set: (auth: Partial<Store['auth']>) => void;
      clear: () => void;
      login: (data: { token: string; user: User; encryption: Encryption }) => void;
      register: (data: { token: string; user: User; encryption: Encryption }) => void;
      unlock: () => void;
    };
  };
}

export const useStore = create<Store>()(
  devtools((set) => ({
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
    ui: { isEditLabelsMenuOpen: false, isSidebarCollapsed: false, gridColumns: 5 },
    api: { loading: false, error: false },
    auth: { user: null, token: null, isAuthenticated: false, isUnlocked: false, encryption: null },
    actions: {
      notes: {
        set: (notesMap) => {
          set((state) => ({
            notes: {
              ...state.notes,
              byId: notesMap,
            },
          }));
        },
        create: (note) => {
          set((state) => ({
            notes: {
              ...state.notes,
              byId: {
                [note.id]: {
                  ...note,
                  isTrashed: false,
                },
                ...state.notes.byId,
              },
              order: [note.id, ...state.notes.order],
            },
          }));
        },
        update: (id, note) => {
          set((state) => {
            const existingNote = state.notes.byId[id];
            if (!existingNote) return state;
            return {
              notes: {
                ...state.notes,
                byId: {
                  ...state.notes.byId,
                  [id]: { ...existingNote, ...note },
                },
              },
            };
          });
        },
        delete: (id) => {
          set((state) => {
            const { [id]: deleted, ...remainingNotes } = state.notes.byId;
            return {
              notes: {
                ...state.notes,
                byId: remainingNotes,
                order: state.notes.order.filter((noteId) => noteId !== id),
              },
            };
          });
        },
        addLabel: (noteId, labelId) => {
          set((state) => {
            const note = state.notes.byId[noteId];
            if (!note) return state;
            return {
              notes: {
                ...state.notes,
                byId: {
                  ...state.notes.byId,
                  [noteId]: { ...note, labelIds: [...note.labelIds, labelId] },
                },
              },
            };
          });
        },
        removeLabel: (noteId, labelId) => {
          set((state) => {
            const note = state.notes.byId[noteId];
            if (!note) return state;
            return {
              notes: {
                ...state.notes,
                byId: {
                  ...state.notes.byId,
                  [noteId]: { ...note, labelIds: note.labelIds.filter((id) => id !== labelId) },
                },
              },
            };
          });
        },
        createLabelAndAddToNote: (noteId, label) => {
          set((state) => {
            const note = state.notes.byId[noteId];
            if (!note) return state;
            return {
              labels: {
                ...state.labels,
                byId: {
                  [label.id]: label,
                  ...state.labels.byId,
                },
              },
              notes: {
                ...state.notes,
                byId: {
                  ...state.notes.byId,
                  [noteId]: { ...note, labelIds: [...note.labelIds, label.id] },
                },
              },
            };
          });
        },
      },
      notesOrder: {
        set: (notesOrder) => {
          set((state) => ({ notes: { ...state.notes, order: notesOrder } }));
        },
        swap: (noteId, overId) => {
          set((state) => {
            const newOrder = [...state.notes.order];
            const fromIndex = newOrder.indexOf(noteId);
            const toIndex = newOrder.indexOf(overId);

            if (fromIndex === -1 || toIndex === -1) {
              return state;
            }

            newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, noteId);
            return { notes: { ...state.notes, order: newOrder } };
          });
        },
      },
      noteHeights: {
        update: (id, height) => {
          set((state) => {
            if (state.notes.heights[id] === height) return state;
            return { notes: { ...state.notes, heights: { ...state.notes.heights, [id]: height } } };
          });
        },
      },
      activeNote: {
        set: (activeNote) => {
          set((state) => ({ notes: { ...state.notes, active: activeNote } }));
        },
      },
      labels: {
        set: (labelsMap) => {
          set((state) => ({
            labels: {
              ...state.labels,
              byId: labelsMap,
            },
          }));
        },
        create: (label) => {
          set((state) => ({
            labels: {
              ...state.labels,
              byId: {
                [label.id]: label,
                ...state.labels.byId,
              },
            },
          }));
        },
        update: (id, label) => {
          set((state) => {
            const existingLabel = state.labels.byId[id];
            if (!existingLabel) return state;
            return {
              labels: {
                ...state.labels,
                byId: {
                  ...state.labels.byId,
                  [id]: { ...existingLabel, ...label },
                },
              },
            };
          });
        },
        delete: (id) => {
          set((state) => {
            const { [id]: deleted, ...remainingLabels } = state.labels.byId;
            const updatedNotes = Object.fromEntries(
              Object.entries(state.notes.byId).map(([noteId, note]) => [
                noteId,
                {
                  ...note,
                  labelIds: note.labelIds.filter((labelId) => labelId !== id),
                },
              ]),
            );
            return {
              notes: {
                ...state.notes,
                byId: updatedNotes,
              },
              labels: {
                ...state.labels,
                byId: remainingLabels,
              },
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
      api: {
        set: (status) => {
          set((state) => ({ api: { ...state.api, ...status } }));
        },
      },
      auth: {
        set: (auth) => {
          set((state) => ({ auth: { ...state.auth, ...auth } }));
        },
        clear: () => {
          set({
            auth: {
              user: null,
              token: null,
              isAuthenticated: false,
              isUnlocked: false,
              encryption: null,
            },
          });
        },
        login: (data) => {
          set({
            auth: {
              token: data.token,
              user: data.user,
              encryption: data.encryption,
              isAuthenticated: true,
              isUnlocked: true,
            },
          });
        },
        register: (data) => {
          set({
            auth: {
              token: data.token,
              user: data.user,
              encryption: data.encryption,
              isAuthenticated: true,
              isUnlocked: true,
            },
          });
        },
        unlock: () => {
          set((state) => ({
            auth: {
              ...state.auth,
              isUnlocked: true,
            },
          }));
        },
      },
    },
  })),
);

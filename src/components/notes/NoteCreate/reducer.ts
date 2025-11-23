import type { Color, DraftNote, Label } from '@/types';

export type NoteAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'ADD_LABEL'; payload: Label }
  | { type: 'REMOVE_LABEL'; payload: string }
  | { type: 'RESET' }
  | { type: 'SET_COLOR'; payload: Color | null }
  | { type: 'SET_ARCHIVED'; payload: boolean }
  | { type: 'TOGGLE_PINNED' };

export const initialState: DraftNote = {
  colorId: 'default',
  isPinned: false,
  isArchived: false,
  title: '',
  content: '',
  labels: [],
};

export const noteReducer = (state: DraftNote, action: NoteAction): DraftNote => {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'ADD_LABEL':
      return { ...state, labels: [...state.labels, action.payload] };
    case 'REMOVE_LABEL':
      return { ...state, labels: state.labels.filter((l: Label) => l.id !== action.payload) };
    case 'RESET':
      return initialState;
    case 'SET_COLOR':
      return {
        ...state,
        colorId: action.payload?.id || 'default',
      };
    case 'SET_ARCHIVED':
      return { ...state, isArchived: action.payload };
    case 'TOGGLE_PINNED':
      return { ...state, isPinned: !state.isPinned };
    default:
      return state;
  }
};

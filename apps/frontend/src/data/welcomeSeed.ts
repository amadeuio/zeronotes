import type { Note } from '@zeronotes/shared';

type WelcomeLabel = {
  key: string;
  name: string;
};

type WelcomeNote = Omit<Note, 'id' | 'labelIds'> & {
  labelKeys: string[];
};

export const welcomeLabels: WelcomeLabel[] = [{ key: 'tips', name: 'Tips' }];

export const welcomeNotes: WelcomeNote[] = [
  {
    title: '👋 Welcome to your account',
    content:
      'Your notes are end-to-end encrypted and synced to your account. Only you can read them.',
    colorId: 'default',
    labelKeys: ['tips'],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    title: 'Create a note',
    content: 'Use the input at the top to add a new note. Changes save automatically.',
    colorId: 'mint',
    labelKeys: ['tips'],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    title: 'Labels & colors',
    content:
      'Open a note to change its color. Create labels from the sidebar to organize notes across views.',
    colorId: 'sage',
    labelKeys: ['tips'],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    title: 'Pin what matters',
    content: 'Pin a note from its toolbar to keep it at the top of your grid.',
    colorId: 'peach',
    labelKeys: [],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
];

import type { Label, Note } from '@zeronotes/shared';

const LABEL_WORK_ID = 'b1a2c3d4-0001-4000-8000-000000000001';
const LABEL_IDEAS_ID = 'b1a2c3d4-0001-4000-8000-000000000002';
const LABEL_PERSONAL_ID = 'b1a2c3d4-0001-4000-8000-000000000003';

const NOTE_1_ID = 'a0000000-0000-4000-8000-000000000001';
const NOTE_2_ID = 'a0000000-0000-4000-8000-000000000002';
const NOTE_3_ID = 'a0000000-0000-4000-8000-000000000003';
const NOTE_4_ID = 'a0000000-0000-4000-8000-000000000004';
const NOTE_5_ID = 'a0000000-0000-4000-8000-000000000005';
const NOTE_6_ID = 'a0000000-0000-4000-8000-000000000006';

export const DEMO_LABELS: Record<string, Label> = {
  [LABEL_WORK_ID]: { id: LABEL_WORK_ID, name: 'Work' },
  [LABEL_IDEAS_ID]: { id: LABEL_IDEAS_ID, name: 'Ideas' },
  [LABEL_PERSONAL_ID]: { id: LABEL_PERSONAL_ID, name: 'Personal' },
};

const DEMO_NOTES_LIST: Note[] = [
  {
    id: NOTE_1_ID,
    title: 'Welcome to Zeronotes',
    content:
      'Everything here is end-to-end encrypted — only you can read your notes.\n\nThis is a demo. Feel free to create, edit, and organise notes. When you\'re ready, create a free account to save them.',
    colorId: 'default',
    labelIds: [],
    isPinned: true,
    isArchived: false,
    isTrashed: false,
  },
  {
    id: NOTE_2_ID,
    title: 'Q3 goals',
    content: '• Ship the new onboarding flow\n• Reduce load time under 1s\n• Write up the API docs',
    colorId: 'fog',
    labelIds: [LABEL_WORK_ID],
    isPinned: true,
    isArchived: false,
    isTrashed: false,
  },
  {
    id: NOTE_3_ID,
    title: 'App ideas',
    content:
      'A habit tracker that ties streaks to a calendar heat-map.\n\nA local-first budgeting tool — no cloud, no subscription.',
    colorId: 'mint',
    labelIds: [LABEL_IDEAS_ID],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    id: NOTE_4_ID,
    title: 'Books to read',
    content: 'Thinking, Fast and Slow\nThe Pragmatic Programmer\nAtomic Habits',
    colorId: 'default',
    labelIds: [LABEL_PERSONAL_ID],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    id: NOTE_5_ID,
    title: 'Grocery list',
    content: 'Oat milk\nEggs\nSourdough bread\nAvocados\nGreek yoghurt',
    colorId: 'sand',
    labelIds: [LABEL_PERSONAL_ID],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    id: NOTE_6_ID,
    title: 'Meeting notes — product sync',
    content:
      'Discussed the new note-sharing feature. Needs more design work before dev picks it up.\n\nAction items:\n- UX team to provide updated wireframes by Friday\n- Backend to scope the permissions model',
    colorId: 'default',
    labelIds: [LABEL_WORK_ID],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
];

export const DEMO_NOTES: Record<string, Note> = Object.fromEntries(
  DEMO_NOTES_LIST.map((note) => [note.id, note]),
);

export const DEMO_NOTES_ORDER: string[] = DEMO_NOTES_LIST.map((note) => note.id);

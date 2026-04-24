import crypto from 'crypto';
import pool from '../src/db/client';
import { hashPassword } from '../src/utils/crypto';

// Constants from encryption setup
const ENCRYPTION_VERSION = 1;
const KDF_ITERATIONS = 600_000;
const GCM_IV_LENGTH = 12;
const PBKDF2_HASH = 'SHA-256';

// Demo account details
const DEMO_EMAIL = 'demo@zeronotes.app';
const DEMO_PASSWORD = 'demo123demo';
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

// Sample notes (copied from frontend/src/data/notes.ts)
const sampleNotes = [
  {
    id: '1',
    title: '👋 Welcome to Zeronotes',
    content: 'A minimal & fast notes app with React.',
    colorId: 'default',
    labelIds: [],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '2',
    title: '🚀 Features',
    content:
      '- Create and edit notes\n- Pin and unpin\n- Drag and drop to reorder\n- Real-time search\n- Change colors and labels\n- Archive or trash notes',
    colorId: 'coral',
    labelIds: [],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '3',
    title: 'Tech Stack',
    content: '- React\n- TypeScript\n- Zustand\n- Tailwind CSS',
    colorId: 'default',
    labelIds: ['1'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '4',
    title: 'Search 🔍',
    content: 'Try typing in the search bar.',
    colorId: 'default',
    labelIds: [],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '5',
    title: '✋ Drag & Drop',
    content: 'Built from scratch with TypeScript & CSS — no external libraries.',
    colorId: 'sand',
    labelIds: [],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '6',
    title: 'Grocery list 🥑',
    content: '- Eggs\n- Avocado\n- Beans\n- Olive oil',
    colorId: 'mint',
    labelIds: ['3', '4'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '7',
    title: 'Books to read',
    content: '- Deep Work\n- Sapiens\n- The Almanack of Naval Ravikant',
    colorId: 'default',
    labelIds: ['2'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '8',
    title: '⚡ Pin me!',
    content: 'Pinned notes always stay at the top. Try it out.',
    colorId: 'peach',
    labelIds: [],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '9',
    title: 'Current Brew',
    content: 'Arabica Washed, Jaltenango (Chiapas) ☕️',
    colorId: 'default',
    labelIds: ['4', '2'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '10',
    title: '🌊 Minimalism',
    content: "The best code is the one you don't have to write.",
    colorId: 'chalk',
    labelIds: ['1'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '11',
    title: 'Quote of the day',
    content: 'Focus is a superpower — protect it ruthlessly.',
    colorId: 'default',
    labelIds: ['5'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '12',
    title: 'Trip ideas 🌍',
    content: '- Oaxaca\n- Lisbon\n- Costa Rica (again?)',
    colorId: 'fog',
    labelIds: ['2'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
  {
    id: '13',
    title: 'Edit a Note ✏️',
    content: 'Click on a note to edit it.',
    colorId: 'default',
    labelIds: ['1'],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
  },
  {
    id: '14',
    title: 'Color Test 🎨',
    content: 'Click on the palette at the bottom of a note.',
    colorId: 'sage',
    labelIds: ['1', '6'],
    isArchived: false,
    isPinned: false,
    isTrashed: false,
  },
];

// Utility functions for encryption
const encodeBase64 = (buffer: Buffer): string => buffer.toString('base64');

const packVersionedPayload = (version: number, payloadBase64: string): string =>
  `${version}:${payloadBase64}`;

const deriveKEK = async (
  password: string,
  salt: Buffer,
  iterations: number,
): Promise<crypto.webcrypto.CryptoKey> => {
  const passwordBuffer = Buffer.from(password, 'utf-8');
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['wrapKey', 'unwrapKey'],
  );
};

const generateDataKey = async (): Promise<crypto.webcrypto.CryptoKey> => {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
};

const wrapDataKey = async (
  dataKey: crypto.webcrypto.CryptoKey,
  kek: crypto.webcrypto.CryptoKey,
): Promise<string> => {
  const iv = crypto.randomBytes(GCM_IV_LENGTH);
  const wrapped = await crypto.subtle.wrapKey('raw', dataKey, kek, { name: 'AES-GCM', iv });
  const combined = Buffer.concat([iv, Buffer.from(wrapped)]);
  return encodeBase64(combined);
};

const encryptString = async (
  plaintext: string,
  dataKey: crypto.webcrypto.CryptoKey,
): Promise<string> => {
  const iv = crypto.randomBytes(GCM_IV_LENGTH);
  const encoded = Buffer.from(plaintext, 'utf-8');

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    dataKey,
    encoded,
  );

  const combined = Buffer.concat([iv, Buffer.from(ciphertext)]);
  const payloadBase64 = encodeBase64(combined);
  return packVersionedPayload(ENCRYPTION_VERSION, payloadBase64);
};

// Label mapping (from sample notes)
const labelMap = new Map<string, string>([
  ['1', 'Tech'],
  ['2', 'Personal'],
  ['3', 'Shopping'],
  ['4', 'Favorites'],
  ['5', 'Quotes'],
  ['6', 'Design'],
]);

const seedDemoAccount = async () => {
  try {
    console.log('Starting demo account seeding...');

    // Generate encryption details
    const salt = crypto.randomBytes(16);
    const kek = await deriveKEK(DEMO_PASSWORD, salt, KDF_ITERATIONS);
    const dataKey = await generateDataKey();
    const wrappedDataKey = await wrapDataKey(dataKey, kek);
    const passwordHash = await hashPassword(DEMO_PASSWORD);

    console.log('Generated encryption keys');

    // Create demo user
    await pool.query(
      `INSERT INTO users (
        id, email, name, password_hash, encryption_salt, wrapped_data_key, kdf_iterations, encryption_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        encryption_salt = EXCLUDED.encryption_salt,
        wrapped_data_key = EXCLUDED.wrapped_data_key,
        kdf_iterations = EXCLUDED.kdf_iterations,
        encryption_version = EXCLUDED.encryption_version`,
      [
        DEMO_USER_ID,
        DEMO_EMAIL,
        'Demo User',
        passwordHash,
        encodeBase64(salt),
        wrappedDataKey,
        KDF_ITERATIONS,
        ENCRYPTION_VERSION,
      ],
    );

    console.log(`Created demo user: ${DEMO_EMAIL}`);

    // Delete existing notes and labels for demo user
    await pool.query('DELETE FROM notes WHERE user_id = $1', [DEMO_USER_ID]);
    await pool.query('DELETE FROM labels WHERE user_id = $1', [DEMO_USER_ID]);

    console.log('Cleaned up existing demo data');

    // Create labels
    const labelIds: Record<string, string> = {};
    for (const [oldId, name] of labelMap.entries()) {
      const newId = crypto.randomUUID();
      const encryptedName = await encryptString(name, dataKey);
      await pool.query('INSERT INTO labels (id, user_id, name) VALUES ($1, $2, $3)', [
        newId,
        DEMO_USER_ID,
        encryptedName,
      ]);
      labelIds[oldId] = newId;
      console.log(`Created label: ${name}`);
    }

    // Create notes with encryption
    for (let i = 0; i < sampleNotes.length; i++) {
      const note = sampleNotes[i];
      const noteId = crypto.randomUUID();
      const encryptedTitle = await encryptString(note.title, dataKey);
      const encryptedContent = await encryptString(note.content, dataKey);

      await pool.query(
        `INSERT INTO notes (
          id, user_id, "order", title, content, color_id, is_pinned, is_archived, is_trashed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          noteId,
          DEMO_USER_ID,
          i,
          encryptedTitle,
          encryptedContent,
          note.colorId,
          note.isPinned,
          note.isArchived,
          note.isTrashed,
        ],
      );

      // Add label associations
      if (note.labelIds && note.labelIds.length > 0) {
        for (const oldLabelId of note.labelIds) {
          const newLabelId = labelIds[oldLabelId];
          if (newLabelId) {
            await pool.query('INSERT INTO note_labels (note_id, label_id) VALUES ($1, $2)', [
              noteId,
              newLabelId,
            ]);
          }
        }
      }

      console.log(`Created note: ${note.title}`);
    }

    console.log('\n✅ Demo account seeded successfully!');
    console.log(`Email: ${DEMO_EMAIL}`);
    console.log(`Password: ${DEMO_PASSWORD}`);
    console.log(`Total notes: ${sampleNotes.length}`);
    console.log(`Total labels: ${labelMap.size}`);
  } catch (error) {
    console.error('Error seeding demo account:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

seedDemoAccount();

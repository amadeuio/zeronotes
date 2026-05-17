import type { Label, Note } from '@zeronotes/shared';
import { PoolClient } from 'pg';
import pool from '../../db/client';

const insertLabels = async (client: PoolClient, userId: string, labels: Label[]): Promise<void> => {
  if (labels.length === 0) return;

  const placeholders: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  for (const label of labels) {
    placeholders.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
    params.push(userId, label.id, label.name);
  }

  await client.query(
    `INSERT INTO labels (user_id, id, name) VALUES ${placeholders.join(', ')}`,
    params,
  );
};

const insertNotes = async (client: PoolClient, userId: string, notes: Note[]): Promise<void> => {
  if (notes.length === 0) return;

  const placeholders: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    placeholders.push(
      `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`,
    );
    params.push(
      userId,
      note.id,
      i,
      note.title,
      note.content,
      note.colorId,
      note.isPinned,
      note.isArchived,
      note.isTrashed,
    );
  }

  await client.query(
    `INSERT INTO notes (user_id, id, "order", title, content, color_id, is_pinned, is_archived, is_trashed)
     VALUES ${placeholders.join(', ')}`,
    params,
  );
};

const insertNoteLabels = async (client: PoolClient, notes: Note[]): Promise<void> => {
  const placeholders: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  for (const note of notes) {
    for (const labelId of note.labelIds) {
      placeholders.push(`($${paramIndex++}, $${paramIndex++})`);
      params.push(note.id, labelId);
    }
  }

  if (placeholders.length === 0) return;

  await client.query(
    `INSERT INTO note_labels (note_id, label_id) VALUES ${placeholders.join(', ')}`,
    params,
  );
};

export const seedRepository = {
  seedContent: async (userId: string, labels: Label[], notes: Note[]): Promise<void> => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await insertLabels(client, userId, labels);
      await insertNotes(client, userId, notes);
      await insertNoteLabels(client, notes);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

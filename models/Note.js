const pool = require('../config/database');

const Note = {
  findAll: async () => {
    const result = await pool.query(
      `SELECT 
        n.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'name', l.name
            )
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'::json
        ) as labels
      FROM notes n
      LEFT JOIN note_labels nl ON n.id = nl.note_id
      LEFT JOIN labels l ON nl.label_id = l.id
      GROUP BY n.id
      ORDER BY n.created_at DESC`
    );
    return result.rows;
  },

  create: async (title, content, colorId = 'default', isPinned = false, isArchived = false) => {
    const result = await pool.query(
      'INSERT INTO notes (title, content, color_id, is_pinned, is_archived) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, colorId, isPinned, isArchived]
    );
    return result.rows[0];
  },

  update: async (id, title, content, colorId, isPinned, isArchived, isTrashed) => {
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, color_id = $3, is_pinned = $4, is_archived = $5, is_trashed = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [title, content, colorId, isPinned, isArchived, isTrashed, id]
    );
    return result.rows[0];
  },

  deleteById: async (id) => {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = Note;


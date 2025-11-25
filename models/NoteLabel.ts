import pool from "../config/database";

const NoteLabel = {
  addLabelToNote: async (noteId: string, labelId: string): Promise<void> => {
    const query = `
      INSERT INTO note_labels (note_id, label_id)
      VALUES ($1, $2)
      ON CONFLICT (note_id, label_id) DO NOTHING
    `;
    await pool.query(query, [noteId, labelId]);
  },

  removeLabelFromNote: async (
    noteId: string,
    labelId: string
  ): Promise<void> => {
    const query = `
      DELETE FROM note_labels WHERE note_id = $1 AND label_id = $2
    `;
    await pool.query(query, [noteId, labelId]);
  },

  addLabelsToNote: async (
    noteId: string,
    labelIds: string[]
  ): Promise<void> => {
    const values = [];
    const params = [noteId];
    let paramIndex = 2;

    for (const labelId of labelIds) {
      values.push(`($1, $${paramIndex})`);
      params.push(labelId);
      paramIndex++;
    }

    const query = `
      INSERT INTO note_labels (note_id, label_id)
      VALUES ${values.join(", ")}
      ON CONFLICT (note_id, label_id) DO NOTHING
    `;

    await pool.query(query, params);
  },
};

export default NoteLabel;

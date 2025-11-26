import { LabelDB } from "../../domain/labels/label.types";
import pool from "../client";

export const labelQueries = {
  findAll: async (): Promise<LabelDB[]> => {
    const result = await pool.query(
      "SELECT * FROM labels ORDER BY created_at DESC"
    );
    return result.rows;
  },

  create: async (id: string, name: string): Promise<LabelDB> => {
    const result = await pool.query(
      "INSERT INTO labels (id, name) VALUES ($1, $2) RETURNING *",
      [id, name]
    );
    return result.rows[0];
  },

  update: async (id: string, name: string): Promise<LabelDB> => {
    const result = await pool.query(
      "UPDATE labels SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [name, id]
    );
    return result.rows[0];
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await pool.query("DELETE FROM labels WHERE id = $1", [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },
};

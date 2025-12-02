import pool from '../../db/client';
import { UserRow } from './users.types';

export const userRepository = {
  findByEmail: async (email: string): Promise<UserRow | null> => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  findById: async (id: string): Promise<UserRow | null> => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  create: async (
    id: string,
    email: string,
    passwordHash: string,
    encryptionSalt: string | null,
    wrappedDataKey: string | null,
    kdfIterations: number | null,
    encryptionVersion: number | null,
  ): Promise<UserRow> => {
    const result = await pool.query(
      `INSERT INTO users (
         id,
         email,
         password_hash,
         encryption_salt,
         wrapped_data_key,
         kdf_iterations,
         encryption_version
       ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [id, email, passwordHash, encryptionSalt, wrappedDataKey, kdfIterations, encryptionVersion],
    );
    return result.rows[0];
  },
};

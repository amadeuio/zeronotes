import type { Encryption } from '@zeronotes/shared';
import pool from '../../db/client';
import { UserRow } from './auth.types';

export const authRepository = {
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
    name: string | null,
    passwordHash: string,
    encryption: Encryption,
  ): Promise<UserRow> => {
    const result = await pool.query(
      `INSERT INTO users (
         id,
         email,
         name,
         password_hash,
         encryption_salt,
         wrapped_data_key,
         kdf_iterations,
         encryption_version
       ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        id,
        email,
        name,
        passwordHash,
        encryption.salt,
        encryption.wrappedDataKey,
        encryption.kdfIterations,
        encryption.version,
      ],
    );
    return result.rows[0];
  },
};

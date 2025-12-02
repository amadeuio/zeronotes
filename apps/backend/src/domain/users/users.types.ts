export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  encryption_salt: string | null;
  wrapped_data_key: string | null;
  kdf_iterations: number | null;
  encryption_version: number | null;
  created_at: Date;
  updated_at: Date;
}

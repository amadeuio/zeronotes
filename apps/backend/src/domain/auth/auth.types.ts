export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  encryption_salt: string;
  wrapped_data_key: string;
  kdf_iterations: number;
  encryption_version: number;
  created_at: Date;
  updated_at: Date;
}

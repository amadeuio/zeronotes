-- Seed all data: users, notes, labels, and note_labels
-- This seed file creates two test users and splits sample data between them

-- Clear existing data (in reverse order due to foreign keys)
TRUNCATE note_labels CASCADE;
TRUNCATE labels CASCADE;
TRUNCATE notes CASCADE;
TRUNCATE users CASCADE;

-- Insert two test users
-- Password: "password123" (hashed with argon2)
INSERT INTO users (id, email, password_hash, created_at) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test@example.com', '$argon2id$v=19$m=65536,t=3,p=4$bXAq1U00hb9gDY5Wic1Bag$FoMfRnnUPmQS4s59k6TBLeS+w5Qz1Ctz7/iBvxWZK0w', '2024-01-01 00:00:00'),
  ('00000000-0000-0000-0000-000000000002', 'test2@example.com', '$argon2id$v=19$m=65536,t=3,p=4$bXAq1U00hb9gDY5Wic1Bag$FoMfRnnUPmQS4s59k6TBLeS+w5Qz1Ctz7/iBvxWZK0w', '2024-01-01 00:00:00');

-- Insert notes (split between two users)
-- User 1 notes: Welcome Note, Shopping List, Meeting Notes, Personal Reminder
-- User 2 notes: Ideas for Project, Archived Note, Important Task
INSERT INTO notes (id, user_id, "order", title, content, color_id, is_pinned, is_archived, is_trashed, created_at) VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1, 'Welcome Note', 'This is your first note! Start writing...', 'default', false, false, false, '2024-01-01 10:00:00'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 2, 'Shopping List', 'Milk, Eggs, Bread, Cheese', 'yellow', false, false, false, '2024-01-01 10:00:00'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 3, 'Meeting Notes', 'Discuss project timeline and deliverables', 'blue', true, false, false, '2024-01-01 10:00:00'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 4, 'Personal Reminder', 'Call mom this weekend', 'green', false, false, false, '2024-01-01 10:00:00'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 1, 'Ideas for Project', 'Feature ideas: dark mode, search, filters', 'purple', false, false, false, '2024-01-01 10:00:00'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 2, 'Archived Note', 'This note is archived', 'default', false, true, false, '2024-01-01 10:00:00'),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 3, 'Important Task', 'Complete the backend API by Friday', 'red', true, false, false, '2024-01-01 10:00:00');

-- Insert labels (split between two users)
-- User 1 labels: Work, Personal, Shopping
-- User 2 labels: Ideas, Archive, Important, Urgent
INSERT INTO labels (id, user_id, name, created_at) VALUES 
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Work', '2024-01-01 10:00:00'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Personal', '2024-01-01 09:00:00'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Shopping', '2024-01-01 08:00:00'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Ideas', '2024-01-01 07:00:00'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Archive', '2024-01-01 06:00:00'),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'Important', '2024-01-01 05:00:00'),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'Urgent', '2024-01-01 04:00:00');

-- Insert note_labels relationships
-- User 1 notes can only reference User 1 labels
-- User 2 notes can only reference User 2 labels
INSERT INTO note_labels (note_id, label_id) VALUES 
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'), -- Welcome Note -> Work
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002'), -- Welcome Note -> Personal
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003'), -- Shopping List -> Shopping
  ('10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001'), -- Meeting Notes -> Work
  ('10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002'), -- Personal Reminder -> Personal
  ('10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004'), -- Ideas for Project -> Ideas
  ('10000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000006'), -- Important Task -> Important
  ('10000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000007'), -- Important Task -> Urgent
  ('10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000005'); -- Archived Note -> Archive


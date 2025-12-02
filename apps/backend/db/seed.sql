-- Seed all data: users, notes, labels, and note_labels
-- This seed file creates two test users and splits sample data between them

TRUNCATE note_labels CASCADE;
TRUNCATE labels CASCADE;
TRUNCATE notes CASCADE;
TRUNCATE users CASCADE;

DO $$
DECLARE
  user1_id UUID := gen_random_uuid();
  user2_id UUID := gen_random_uuid();
  note1_id UUID := gen_random_uuid();  
  note2_id UUID := gen_random_uuid();  
  note3_id UUID := gen_random_uuid();
  note4_id UUID := gen_random_uuid();
  note5_id UUID := gen_random_uuid();
  note6_id UUID := gen_random_uuid();
  note7_id UUID := gen_random_uuid();
  label1_id UUID := gen_random_uuid();
  label2_id UUID := gen_random_uuid();
  label3_id UUID := gen_random_uuid();
  label4_id UUID := gen_random_uuid();
  label5_id UUID := gen_random_uuid();
  label6_id UUID := gen_random_uuid();
  label7_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO users (id, email, password_hash, created_at) VALUES 
    (user1_id, 'test@example.com', '$argon2id$v=19$m=65536,t=3,p=4$bXAq1U00hb9gDY5Wic1Bag$FoMfRnnUPmQS4s59k6TBLeS+w5Qz1Ctz7/iBvxWZK0w', '2024-01-01 00:00:00'),
    (user2_id, 'test2@example.com', '$argon2id$v=19$m=65536,t=3,p=4$bXAq1U00hb9gDY5Wic1Bag$FoMfRnnUPmQS4s59k6TBLeS+w5Qz1Ctz7/iBvxWZK0w', '2024-01-01 00:00:00');

  INSERT INTO notes (id, user_id, "order", title, content, color_id, is_pinned, is_archived, is_trashed, created_at) VALUES 
    (note1_id, user1_id, 1, 'Welcome Note', 'This is your first note! Start writing...', 'default', false, false, false, '2024-01-01 10:00:00'),
    (note2_id, user1_id, 2, 'Shopping List', 'Milk, Eggs, Bread, Cheese', 'yellow', false, false, false, '2024-01-01 10:00:00'),
    (note3_id, user1_id, 3, 'Meeting Notes', 'Discuss project timeline and deliverables', 'blue', true, false, false, '2024-01-01 10:00:00'),
    (note4_id, user1_id, 4, 'Personal Reminder', 'Call mom this weekend', 'green', false, false, false, '2024-01-01 10:00:00'),
    (note5_id, user2_id, 1, 'Ideas for Project', 'Feature ideas: dark mode, search, filters', 'purple', false, false, false, '2024-01-01 10:00:00'),
    (note6_id, user2_id, 2, 'Archived Note', 'This note is archived', 'default', false, true, false, '2024-01-01 10:00:00'),
    (note7_id, user2_id, 3, 'Important Task', 'Complete the backend API by Friday', 'red', true, false, false, '2024-01-01 10:00:00');

  INSERT INTO labels (id, user_id, name, created_at) VALUES 
    (label1_id, user1_id, 'Work', '2024-01-01 10:00:00'),
    (label2_id, user1_id, 'Personal', '2024-01-01 09:00:00'),
    (label3_id, user1_id, 'Shopping', '2024-01-01 08:00:00'),
    (label4_id, user2_id, 'Ideas', '2024-01-01 07:00:00'),
    (label5_id, user2_id, 'Archive', '2024-01-01 06:00:00'),
    (label6_id, user2_id, 'Important', '2024-01-01 05:00:00'),
    (label7_id, user2_id, 'Urgent', '2024-01-01 04:00:00');

  INSERT INTO note_labels (note_id, label_id) VALUES 
    (note1_id, label1_id),
    (note1_id, label2_id),
    (note2_id, label3_id),
    (note3_id, label1_id),
    (note4_id, label2_id),
    (note5_id, label4_id),
    (note7_id, label6_id),
    (note7_id, label7_id),
    (note6_id, label5_id);
END $$;
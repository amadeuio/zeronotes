import { v4 as uuidv4 } from 'uuid';
import { createTestApi } from './setup/app';
import { makeTestHelpers } from './setup/helpers';

describe('Notes Endpoints', () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;
  let token: string;

  beforeEach(async () => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
    token = await helpers.getAuthToken();
  });

  describe('POST /api/notes', () => {
    it('should create a new note with valid data', async () => {
      const response = await helpers.createNote(token, {
        title: 'My Note',
        content: 'Note content',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should create a note with empty content', async () => {
      const response = await helpers.createNote(token, {
        title: 'Title Only',
        content: '',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.post('/api/notes').send({
        title: 'Test Note',
        content: 'Test Content',
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 when title is missing', async () => {
      const response = await api.post('/api/notes').set('Authorization', `Bearer ${token}`).send({
        content: 'Content without title',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/notes', () => {
    it('should return all notes for authenticated user', async () => {
      // Create a couple of notes
      await helpers.createNote(token, {
        title: 'Note 1',
        content: 'Content 1',
      });
      await helpers.createNote(token, {
        title: 'Note 2',
        content: 'Content 2',
      });

      const response = await api.get('/api/notes').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('notesById');
      expect(response.body).toHaveProperty('notesOrder');
      expect(Array.isArray(response.body.notesOrder)).toBe(true);
      expect(response.body.notesOrder.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.get('/api/notes');

      expect(response.status).toBe(401);
    });

    it('should not return notes from other users', async () => {
      // Create note with first user
      await helpers.createNote(token, {
        title: 'User 1 Note',
        content: 'Content',
      });

      // Create second user and get their notes
      const token2 = await helpers.getAuthToken();
      const response = await api.get('/api/notes').set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('notesById');
      // Second user should not see first user's notes
      const notes = Object.values(response.body.notesById);
      const hasUser1Note = notes.some((note: any) => note.title === 'User 1 Note');
      expect(hasUser1Note).toBe(false);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note with valid data', async () => {
      // Create a note first
      const createResponse = await helpers.createNote(token, {
        title: 'Original Title',
        content: 'Original Content',
      });
      const noteId = createResponse.body.id;

      // Update the note
      const response = await api
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', noteId);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.put('/api/notes/some-id').send({
        title: 'Updated Title',
        content: 'Updated Content',
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 when note does not exist', async () => {
      const response = await api
        .put(`/api/notes/${uuidv4()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        });

      expect(response.status).toBe(404);
    });

    it("should not allow updating another user's note", async () => {
      // Create note with first user
      const createResponse = await helpers.createNote(token, {
        title: 'User 1 Note',
        content: 'Content',
      });
      const noteId = createResponse.body.id;

      // Try to update with second user
      const token2 = await helpers.getAuthToken();
      const response = await api
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          title: 'Hacked Title',
          content: 'Hacked Content',
        });

      expect(response.status).toBe(404); // Should not find the note
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      // Create a note first
      const createResponse = await helpers.createNote(token, {
        title: 'To Delete',
        content: 'Delete me',
      });
      const noteId = createResponse.body.id;

      // Delete the note
      const response = await api
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const getResponse = await api.get('/api/notes').set('Authorization', `Bearer ${token}`);
      expect(getResponse.body.notesById[noteId]).toBeUndefined();
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.delete('/api/notes/some-id');

      expect(response.status).toBe(401);
    });

    it('should return 404 when note does not exist', async () => {
      const response = await api
        .delete(`/api/notes/${uuidv4()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should not allow deleting another user's note", async () => {
      // Create note with first user
      const createResponse = await helpers.createNote(token, {
        title: 'User 1 Note',
        content: 'Content',
      });
      const noteId = createResponse.body.id;

      // Try to delete with second user
      const token2 = await helpers.getAuthToken();
      const response = await api
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(404); // Should not find the note
    });
  });

  describe('POST /api/notes/reorder', () => {
    it('should reorder notes', async () => {
      // Create multiple notes
      const note1 = await helpers.createNote(token, { title: 'Note 1' });
      const note2 = await helpers.createNote(token, { title: 'Note 2' });
      const note3 = await helpers.createNote(token, { title: 'Note 3' });

      const noteIds = [note1.body.id, note2.body.id, note3.body.id];

      // Reorder them
      const response = await api
        .post('/api/notes/reorder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          noteIds: [noteIds[2], noteIds[0], noteIds[1]], // Reverse order
        });

      expect(response.status).toBe(204);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.post('/api/notes/reorder').send({
        noteIds: ['id1', 'id2'],
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 when noteIds is not an array', async () => {
      const response = await api
        .post('/api/notes/reorder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          noteIds: 'not-an-array',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Authentication Security', () => {
    it('should reject slightly modified tokens on all endpoints', async () => {
      const validToken = await helpers.getAuthToken();
      const corruptedToken = helpers.corruptTokenSignature(validToken);

      const getResponse = await api
        .get('/api/notes')
        .set('Authorization', `Bearer ${corruptedToken}`);
      expect(getResponse.status).toBe(401);

      const postResponse = await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${corruptedToken}`)
        .send({ title: 'Test', content: 'Content' });
      expect(postResponse.status).toBe(401);

      const putResponse = await api
        .put(`/api/notes/${uuidv4()}`)
        .set('Authorization', `Bearer ${corruptedToken}`)
        .send({ title: 'Test', content: 'Content' });
      expect(putResponse.status).toBe(401);

      const deleteResponse = await api
        .delete(`/api/notes/${uuidv4()}`)
        .set('Authorization', `Bearer ${corruptedToken}`);
      expect(deleteResponse.status).toBe(401);

      const reorderResponse = await api
        .post('/api/notes/reorder')
        .set('Authorization', `Bearer ${corruptedToken}`)
        .send({ noteIds: ['id1', 'id2'] });
      expect(reorderResponse.status).toBe(401);
    });
  });
});

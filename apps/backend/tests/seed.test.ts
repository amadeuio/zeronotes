import { errorSchema } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';
import { createTestApi } from './setup/app';
import { makeTestHelpers } from './setup/helpers';

describe('POST /api/seed', () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;
  let token: string;

  beforeEach(async () => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
    token = await helpers.getAuthToken();
  });

  const seedPayload = () => {
    const labelId = uuidv4();
    const noteId = uuidv4();

    return {
      labels: [{ id: labelId, name: 'encrypted-label-name' }],
      notes: [
        {
          id: noteId,
          title: 'encrypted-title',
          content: 'encrypted-content',
          colorId: 'mint',
          labelIds: [labelId],
          isPinned: false,
          isArchived: false,
          isTrashed: false,
        },
      ],
    };
  };

  it('should seed labels and notes atomically for the authenticated user', async () => {
    const payload = seedPayload();

    const seedResponse = await api
      .post('/api/seed')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(seedResponse.status).toBe(201);

    const bootstrapResponse = await api
      .get('/api/bootstrap')
      .set('Authorization', `Bearer ${token}`);

    expect(bootstrapResponse.status).toBe(200);
    expect(bootstrapResponse.body.labels).toHaveLength(1);
    expect(bootstrapResponse.body.labels[0].id).toBe(payload.labels[0].id);
    expect(bootstrapResponse.body.notes).toHaveLength(1);
    expect(bootstrapResponse.body.notes[0].id).toBe(payload.notes[0].id);
    expect(bootstrapResponse.body.notes[0].labelIds).toEqual([payload.labels[0].id]);
  });

  it('should return 401 when not authenticated', async () => {
    const response = await api.post('/api/seed').send(seedPayload());
    expect(response.status).toBe(401);
  });

  it('should return 400 when a note references a label not in the batch', async () => {
    const response = await api
      .post('/api/seed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        labels: [],
        notes: [
          {
            id: uuidv4(),
            title: 't',
            content: 'c',
            colorId: 'default',
            labelIds: [uuidv4()],
            isPinned: false,
            isArchived: false,
            isTrashed: false,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it('should return 400 when the batch contains duplicate note ids', async () => {
    const noteId = uuidv4();

    const response = await api
      .post('/api/seed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        labels: [],
        notes: [
          {
            id: noteId,
            title: 'a',
            content: 'a',
            colorId: 'default',
            labelIds: [],
            isPinned: false,
            isArchived: false,
            isTrashed: false,
          },
          {
            id: noteId,
            title: 'b',
            content: 'b',
            colorId: 'default',
            labelIds: [],
            isPinned: false,
            isArchived: false,
            isTrashed: false,
          },
        ],
      });

    expect(response.status).toBe(400);

    const parsed = errorSchema.safeParse(response.body);
    expect(parsed.success).toBe(true);
    expect(response.body.error).toEqual({
      message: `notes: Duplicate note id: ${noteId}`,
      code: 'VALIDATION_ERROR',
      status: 400,
      details: {
        issues: [
          {
            path: ['notes'],
            message: `Duplicate note id: ${noteId}`,
          },
        ],
      },
    });
  });

  it('should return 400 when notes array is empty', async () => {
    const response = await api
      .post('/api/seed')
      .set('Authorization', `Bearer ${token}`)
      .send({ labels: [], notes: [] });

    expect(response.status).toBe(400);
  });

  it('should roll back the entire batch when a duplicate id is inserted', async () => {
    const labelId = uuidv4();
    const noteId = uuidv4();

    await api
      .post('/api/seed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        labels: [{ id: labelId, name: 'first' }],
        notes: [
          {
            id: noteId,
            title: 'first',
            content: 'first',
            colorId: 'default',
            labelIds: [],
            isPinned: false,
            isArchived: false,
            isTrashed: false,
          },
        ],
      });

    const duplicateResponse = await api
      .post('/api/seed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        labels: [{ id: labelId, name: 'duplicate' }],
        notes: [
          {
            id: uuidv4(),
            title: 'second',
            content: 'second',
            colorId: 'default',
            labelIds: [],
            isPinned: false,
            isArchived: false,
            isTrashed: false,
          },
        ],
      });

    expect(duplicateResponse.status).toBeGreaterThanOrEqual(400);

    const bootstrapResponse = await api
      .get('/api/bootstrap')
      .set('Authorization', `Bearer ${token}`);

    expect(bootstrapResponse.body.labels).toHaveLength(1);
    expect(bootstrapResponse.body.labels[0].name).toBe('first');
    expect(bootstrapResponse.body.notes).toHaveLength(1);
    expect(bootstrapResponse.body.notes[0].title).toBe('first');
  });
});

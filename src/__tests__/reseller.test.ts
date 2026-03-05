import request from 'supertest';

jest.mock('../db', () => ({
  __esModule: true,
  default: {
    user: { create: jest.fn(), findUnique: jest.fn() },
    reseller: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('../config', () => ({
  __esModule: true,
  default: {
    secrets: { jwt: 'test-secret-key', jwtExp: '1d' },
    port: 3001,
    stage: 'testing',
    env: 'test',
  },
}));

import app from '../server';
import { createJWT } from '../modules/auth';

const prisma = require('../db').default;
const token = createJWT({ id: '123', username: 'testuser' });
const auth = `Bearer ${token}`;

const mockReseller = {
  id: 'uuid-1',
  createdAt: new Date(),
  licenseDuration: 2,
  resellerId: 'R001',
  name: 'Test Reseller',
  email: 'test@example.com',
  backerId: 'B001',
  pledgeAmount: '100',
  backerNumber: 42,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/reseller', () => {
  it('returns all resellers', async () => {
    prisma.reseller.findMany.mockResolvedValue([mockReseller]);

    const res = await request(app).get('/api/reseller').set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Test Reseller');
  });

  it('returns empty array when no resellers', async () => {
    prisma.reseller.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/reseller').set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('GET /api/reseller/:resellerId', () => {
  it('returns a single reseller', async () => {
    prisma.reseller.findFirst.mockResolvedValue(mockReseller);

    const res = await request(app).get('/api/reseller/R001').set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body.data.resellerId).toBe('R001');
  });

  it('returns 404 when reseller not found', async () => {
    prisma.reseller.findFirst.mockResolvedValue(null);

    const res = await request(app).get('/api/reseller/MISSING').set('Authorization', auth);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Reseller not found');
  });
});

describe('POST /api/reseller', () => {
  it('creates a reseller with valid data', async () => {
    prisma.reseller.create.mockResolvedValue(mockReseller);

    const res = await request(app)
      .post('/api/reseller')
      .set('Authorization', auth)
      .send({
        name: 'Test Reseller',
        email: 'test@example.com',
        backerId: 'B001',
        resellerId: 'R001',
        pledgeAmount: '100',
        backerNumber: 42,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Reseller');
  });

  it('returns 400 with missing required fields', async () => {
    const res = await request(app)
      .post('/api/reseller')
      .set('Authorization', auth)
      .send({ name: 'Only Name' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when backerNumber is not an integer', async () => {
    const res = await request(app)
      .post('/api/reseller')
      .set('Authorization', auth)
      .send({
        name: 'Test',
        email: 'test@example.com',
        backerId: 'B001',
        resellerId: 'R001',
        pledgeAmount: '100',
        backerNumber: 'not-a-number',
      });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/reseller/:id', () => {
  it('updates a reseller', async () => {
    const updated = { ...mockReseller, name: 'Updated Name' };
    prisma.reseller.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/reseller/uuid-1')
      .set('Authorization', auth)
      .send({ name: 'Updated Name', email: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('returns 400 with missing required fields', async () => {
    const res = await request(app)
      .put('/api/reseller/uuid-1')
      .set('Authorization', auth)
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 404 when updating non-existent reseller', async () => {
    const prismaError = new Error('Record not found');
    (prismaError as any).code = 'P2025';
    prisma.reseller.update.mockRejectedValue(prismaError);

    const res = await request(app)
      .put('/api/reseller/nonexistent')
      .set('Authorization', auth)
      .send({ name: 'Test', email: 'test@example.com' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/reseller/:id', () => {
  it('deletes a reseller', async () => {
    prisma.reseller.delete.mockResolvedValue(mockReseller);

    const res = await request(app)
      .delete('/api/reseller/uuid-1')
      .set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('uuid-1');
  });

  it('returns 404 when deleting non-existent reseller', async () => {
    const prismaError = new Error('Record not found');
    (prismaError as any).code = 'P2025';
    prisma.reseller.delete.mockRejectedValue(prismaError);

    const res = await request(app)
      .delete('/api/reseller/nonexistent')
      .set('Authorization', auth);

    expect(res.status).toBe(404);
  });
});

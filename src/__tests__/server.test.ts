import request from 'supertest';

// Mock Prisma before importing app
jest.mock('../db', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
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
    secrets: {
      jwt: 'test-secret-key',
      jwtExp: '1d',
    },
    port: 3001,
    stage: 'testing',
    env: 'test',
  },
}));

import app from '../server';
import { createJWT } from '../modules/auth';

describe('server', () => {
  describe('GET /', () => {
    it('returns server status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Modi server online');
    });
  });

  describe('GET /health', () => {
    it('returns health check response', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('protected routes', () => {
    it('returns 401 on /api routes without token', async () => {
      const res = await request(app).get('/api/reseller');
      expect(res.status).toBe(401);
    });

    it('returns 401 on /user without token', async () => {
      const res = await request(app)
        .post('/user')
        .send({ username: 'test', password: 'test123' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /signin', () => {
    it('returns 400 without credentials', async () => {
      const res = await request(app).post('/signin').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('authenticated access', () => {
    const token = createJWT({ id: '123', username: 'testuser' });

    it('allows access to /api routes with valid token', async () => {
      const prisma = require('../db').default;
      prisma.reseller.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/reseller')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('global error handler', () => {
    const token = createJWT({ id: '123', username: 'testuser' });

    it('handles Prisma P2025 (not found) errors', async () => {
      const prisma = require('../db').default;
      const error = new Error('Not found');
      (error as any).code = 'P2025';
      prisma.reseller.findMany.mockRejectedValue(error);

      const res = await request(app)
        .get('/api/reseller')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Record not found');
    });

    it('handles Prisma P2002 (unique constraint) errors', async () => {
      const prisma = require('../db').default;
      const error = new Error('Unique');
      (error as any).code = 'P2002';
      prisma.reseller.findMany.mockRejectedValue(error);

      const res = await request(app)
        .get('/api/reseller')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('A record with that value already exists');
    });

    it('handles unknown errors as 500', async () => {
      const prisma = require('../db').default;
      prisma.reseller.findMany.mockRejectedValue(new Error('Unexpected'));

      const res = await request(app)
        .get('/api/reseller')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal server error');
    });
  });
});

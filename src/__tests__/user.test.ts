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
import { createJWT, hashPassword } from '../modules/auth';

const prisma = require('../db').default;
const token = createJWT({ id: '123', username: 'admin' });
const auth = `Bearer ${token}`;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /user (create user)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/user')
      .send({ username: 'newuser', password: 'pass123' });

    expect(res.status).toBe(401);
  });

  it('returns 400 without username', async () => {
    const res = await request(app)
      .post('/user')
      .set('Authorization', auth)
      .send({ password: 'pass123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username and password are required');
  });

  it('returns 400 without password', async () => {
    const res = await request(app)
      .post('/user')
      .set('Authorization', auth)
      .send({ username: 'newuser' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username and password are required');
  });

  it('creates a user and returns a token', async () => {
    prisma.user.create.mockResolvedValue({
      id: 'new-uuid',
      username: 'newuser',
      password: 'hashed',
    });

    const res = await request(app)
      .post('/user')
      .set('Authorization', auth)
      .send({ username: 'newuser', password: 'pass123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 409 when username already exists', async () => {
    const prismaError = new Error('Unique constraint');
    (prismaError as any).code = 'P2002';
    prisma.user.create.mockRejectedValue(prismaError);

    const res = await request(app)
      .post('/user')
      .set('Authorization', auth)
      .send({ username: 'existing', password: 'pass123' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Username already exists');
  });
});

describe('POST /signin', () => {
  it('returns 400 without credentials', async () => {
    const res = await request(app).post('/signin').send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username and password are required');
  });

  it('returns 401 with non-existent username', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/signin')
      .send({ username: 'nouser', password: 'pass123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid username or password');
  });

  it('returns 401 with wrong password', async () => {
    const hashed = await hashPassword('correctpass');
    prisma.user.findUnique.mockResolvedValue({
      id: 'uuid-1',
      username: 'testuser',
      password: hashed,
    });

    const res = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid username or password');
  });

  it('returns a token with valid credentials', async () => {
    const hashed = await hashPassword('mypassword');
    prisma.user.findUnique.mockResolvedValue({
      id: 'uuid-1',
      username: 'testuser',
      password: hashed,
    });

    const res = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'mypassword' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

import { createJWT, hashPassword, comparePasswords, protect } from '../modules/auth';
import { Request, Response, NextFunction } from 'express';

// Mock config
jest.mock('../config', () => ({
  __esModule: true,
  default: {
    secrets: {
      jwt: 'test-secret-key',
      jwtExp: '1d',
    },
  },
}));

describe('auth module', () => {
  describe('createJWT', () => {
    it('returns a token string', () => {
      const token = createJWT({ id: '123', username: 'testuser' });
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('hashPassword / comparePasswords', () => {
    it('hashes a password and verifies it', async () => {
      const password = 'mypassword123';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(await comparePasswords(password, hash)).toBe(true);
      expect(await comparePasswords('wrongpassword', hash)).toBe(false);
    });
  });

  describe('protect middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      jsonMock = jest.fn();
      statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      mockReq = { headers: {} };
      mockRes = { status: statusMock, json: jsonMock };
      mockNext = jest.fn();
    });

    it('returns 401 when no authorization header', () => {
      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 when bearer has no token', () => {
      mockReq.headers = { authorization: 'Bearer ' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 for an invalid token', () => {
      mockReq.headers = { authorization: 'Bearer invalidtoken' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('calls next() and sets req.user for a valid token', () => {
      const token = createJWT({ id: '123', username: 'testuser' });
      mockReq.headers = { authorization: `Bearer ${token}` };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as any).user).toMatchObject({
        id: '123',
        username: 'testuser',
      });
    });
  });
});

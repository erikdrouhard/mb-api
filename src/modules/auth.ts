import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import config from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string };
    }
  }
}

export function createJWT(user: { id: string; username: string }): string {
  const options: SignOptions = { expiresIn: config.secrets.jwtExp as SignOptions['expiresIn'] };
  return jwt.sign(
    { id: user.id, username: user.username },
    config.secrets.jwt,
    options
  );
}

export function protect(req: Request, res: Response, next: NextFunction): void {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.secrets.jwt) as {
      id: string;
      username: string;
    };
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }
}

export function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

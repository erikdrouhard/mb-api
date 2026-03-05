import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { createJWT, comparePasswords, hashPassword } from '../modules/auth';

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: await hashPassword(password),
      },
    });

    const token = createJWT(user);
    res.status(201).json({ token });
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }
    next(e);
  }
};

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

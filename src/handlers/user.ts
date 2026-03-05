import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await userService.createUser(req.body.username, req.body.password);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
};

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await userService.signIn(req.body.username, req.body.password);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

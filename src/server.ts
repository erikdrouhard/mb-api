import express, { Request, Response, NextFunction } from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createNewUser, signInUser } from './handlers/user';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Modi server online' });
});

// Public auth route
app.post('/signin', signInUser);

// Protected routes
app.use('/api', protect, router);

// Admin-created accounts: only authenticated users can create new users
app.post('/user', protect, createNewUser);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  // Prisma known errors
  if (err.code === 'P2025') {
    res.status(404).json({ message: 'Record not found' });
    return;
  }
  if (err.code === 'P2002') {
    res.status(409).json({ message: 'A record with that value already exists' });
    return;
  }

  // Application errors
  if (err.type === 'auth') {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  if (err.type === 'input') {
    res.status(400).json({ message: 'Invalid input' });
    return;
  }

  // Default
  res.status(500).json({ message: 'Internal server error' });
});

export default app;

import express, { Request, Response, NextFunction } from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { protect } from './modules/auth';
import { createNewUser, signInUser } from './handlers/user';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

// Rate limit auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Modi server online' });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Public auth route (rate limited)
app.post('/signin', authLimiter, signInUser);

// Protected routes
app.use('/api', protect, router);

// Admin-created accounts: only authenticated users can create new users
app.post('/user', protect, authLimiter, createNewUser);

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

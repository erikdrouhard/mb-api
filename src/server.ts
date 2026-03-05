import express, { Request, Response, NextFunction } from 'express';
import router from './router';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { protect } from './modules/auth';
import { createNewUser, signInUser } from './handlers/user';
import { AppError } from './modules/errors';
import logger from './modules/logger';

const app = express();

app.use(helmet());
app.use(pinoHttp({ logger }));
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
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Application errors (typed)
  if (err instanceof AppError) {
    logger.warn({ statusCode: err.statusCode, message: err.message }, err.message);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Prisma known errors
  if (err && typeof err === 'object' && 'code' in err) {
    const prismaErr = err as { code: string };
    if (prismaErr.code === 'P2025') {
      logger.warn('Prisma record not found');
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    if (prismaErr.code === 'P2002') {
      logger.warn('Prisma unique constraint violation');
      res.status(409).json({ message: 'A record with that value already exists' });
      return;
    }
  }

  // Unexpected errors
  logger.error(err, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
});

export default app;

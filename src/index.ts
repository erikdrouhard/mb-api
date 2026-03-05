import * as dotenv from 'dotenv';
dotenv.config();
import config from './config';
import prisma from './db';
import logger from './modules/logger';

import app from './server';

const server = app.listen(config.port, () => {
  logger.info(`Server is running on http://localhost:${config.port}`);
});

function gracefulShutdown(signal: string) {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed.');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

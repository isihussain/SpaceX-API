import http from 'http';
import mongoose from 'mongoose';
import logger from './middleware/logger.js';
import { DEFAULT_PORT } from './lib/constants.js';
import app from './app.js';

const PORT = process.env.PORT ?? DEFAULT_PORT;
const SERVER = http.createServer(app.callback());

// Gracefully close Mongo connection
const gracefulShutdown = (msg, code = 0) => {
  logger.info(Shutdown initiated: );
  mongoose.connection.close(false, () => {
    logger.info('Mongo closed');
    SERVER.close(() => {
      logger.info('Shutting down...');
      process.exit(code);
    });
  });
};

// Server start
SERVER.listen(PORT, '0.0.0.0', () => {
  logger.info(Running on port: );

  // Handle kill commands
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM', 0));

  // Handle interrupts
  process.on('SIGINT', () => gracefulShutdown('SIGINT', 0));

  // Prevent dirty exit on uncaught exceptions:
  process.on('uncaughtException', (err) => {
    logger.error({
      message: 'Uncaught Exception',
      error: err.message,
      stack: err.stack,
    });
    gracefulShutdown('uncaughtException', 1);
  });

  // Prevent dirty exit on unhandled promise rejection
  process.on('unhandledRejection', (reason) => {
    logger.error({
      message: 'Unhandled Promise Rejection',
      error: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined,
    });
    gracefulShutdown('unhandledRejection', 1);
  });
});
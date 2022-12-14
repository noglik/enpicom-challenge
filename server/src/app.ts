import express from 'express';
import { ValidationError } from './middleware';
import { dnaRouter } from './dna';
import { logger } from './logger';

export const createServer = () => {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));

  app.use('/api/dna', dnaRouter);

  app.use(
    // next is required for express error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message });
      }

      logger.error({ err }, 'Unhandled error occured');
      res.status(500).json({ message: 'Something went wrong' });
    }
  );

  return app;
};

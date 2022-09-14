import express from 'express';
import { dnaRouter } from './dna';
import { logger } from './logger';

export const createServer = () => {
    const app = express();

    app.use(express.json());

    app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));

    app.use('/api/dna', dnaRouter);

    // error handler
    app.use((err: Error, _req: express.Request, res: express.Response) => {
        logger.error({ err }, 'Catched unhandled error');
        res.status(500).send({ message: 'Something went wrong' });
    });

    return app;
};

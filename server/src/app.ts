import express from 'express';

export const createServer = () => {
    const app = express();

    app.use(express.json());

    app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));

    return app;
};

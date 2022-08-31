import { Server } from 'http';
import { promisify } from 'util';
import { createServer } from './app';
import { logger } from './logger';

const PORT = 3000;

const server: Server = createServer().listen(3000, () => {
    logger.log(`Server is up and running on ${PORT}`);
});

const shutdown = async (server: Server) => {
    const closeServer = promisify(server.close).bind(server);
    await closeServer();

    process.exit(0);
};

process
    // Log unhandled errors & warnings
    .on('uncaughtException', (err) => {
        logger.error(`Unhandled exception occured: ${err.message}`);
    })
    .on('unhandledRejection', async (reason) => {
        logger.error(`Unahdled rejection occured: ${reason}`);
    })
    .on('warning', (warning) => {
        logger.warn(`Node.js warning: ${warning}`);
    })
    // Handle application shutdown (posix exit signals)
    .on('SIGTERM', async () => await shutdown(server))
    .on('SIGINT', async () => await shutdown(server))
    .on('exit', (code) => {
        logger.info(`Server exited with ${code}`);
    });

import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';
import { logger } from '../logger';

export let db = null as unknown as Pool;

export const setup = async (connectionString: string) => {
    logger.log('Connecting to DB...');
    try {
        db = new Pool({ connectionString, idleTimeoutMillis: 0, connectionTimeoutMillis: 0 });

        logger.log('Running migrations...');
        const migrations = await migrate({ client: db }, 'src/db/migrations');
        logger.info(`Migrations executed ${migrations}`);
    } catch (err) {
        logger.error({ err }, 'Unexpected DB setup error');
        throw err;
    }

    db.on('error', (err) => {
        logger.error(`Unexpected DB error: ${err}`);
        // TODO: shutdown app
    });
};

export const close = () => {
    logger.log('Closing DB connection');
    return db.end();
};

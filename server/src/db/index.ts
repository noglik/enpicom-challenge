import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';
import { logger } from '../logger';

export let db = null as unknown as Pool;

export const setup = (connectionString: string) => {
    logger.log('Connecting to DB...');
    db = new Pool({ connectionString });

    logger.log('Running migrations...');
    migrate({ client: db }, 'src/db/migrations');

    db.on('error', (err) => {
        logger.error(`Unexpected DB error: ${err}`);
        // TODO: shutdown app
    });
};

export const close = () => {
    logger.log('Closing DB connection');
    return db.end();
};

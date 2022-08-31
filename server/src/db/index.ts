import { Pool } from 'pg';
import { logger } from '../logger';

export let db = null as unknown as Pool;

export const setup = (connectionString: string) => {
    logger.log('Connecting to DB...');
    db = new Pool({ connectionString });

    db.on('error', (err) => {
        logger.error(`Unexpected DB error: ${err}`);
        // TODO: shutdown app
    });
};

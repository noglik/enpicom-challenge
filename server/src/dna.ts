import { Router } from 'express';
import sql from 'sql-template-strings';
import { db } from './db';
import { logger } from './logger';

const INTERNAL_SERVER_ERROR = 500;
const INSERT_ERROR_MESSAGE = 'Cannot insert dna sequence';
const QUERY_ERROR_MESSAGE = 'Cannot query dna sequence';
const GENERIC_ERROR_RESPONSE = 'Something went wrong';

export const dnaRouter = Router();

// add dna string
dnaRouter.post('/', async (req, res) => {
    const { sequence } = req.body;
    try {
        const queryResult = await db.query(
            sql`INSERT INTO dna(sequence) VALUES(${sequence}) RETURNING id`
        );
        return res.json({ id: queryResult.rows[0].id });
    } catch (err) {
        logger.error({ err }, INSERT_ERROR_MESSAGE);
        return res.status(INTERNAL_SERVER_ERROR).send({ message: GENERIC_ERROR_RESPONSE });
    }
});

// query dna
dnaRouter.get('/', async (req, res) => {
    const { sequence, levenshtein } = req.query;

    const query = sql`SELECT id, sequence FROM dna `;
    if (levenshtein) {
        query.append(sql`WHERE levenshtein(sequence, ${sequence})=${levenshtein} `);
    } else {
        query.append(sql`WHERE sequence LIKE ${`%${sequence}%`}`);
    }
    query.append(sql`ORDER BY sequence`);

    try {
        const queryResult = await db.query(query);
        return res.json(queryResult.rows);
    } catch (err) {
        logger.error({ err, sequence }, QUERY_ERROR_MESSAGE);
        return res.status(INTERNAL_SERVER_ERROR).send({ message: GENERIC_ERROR_RESPONSE });
    }
});

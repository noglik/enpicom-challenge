import { Router, Request } from 'express';
import sql from 'sql-template-strings';
import { db } from './db';
import { logger } from './logger';
import { validateAdd, validateRetrieve } from './middleware';

const INSERT_ERROR_MESSAGE = 'Cannot insert dna sequence';
const QUERY_ERROR_MESSAGE = 'Cannot query dna sequence';

export const dnaRouter = Router();

// add dna string
dnaRouter.post(
    '/',
    validateAdd,
    // it's possible to infer body from validateAdd
    async (req: Request<never, { id: number }, { sequence: string }>, res) => {
        const { sequence } = req.body;
        try {
            const queryResult = await db.query<{ id: number }>(
                sql`INSERT INTO dna(sequence) VALUES(${sequence}) RETURNING id`
            );
            return res.json({ id: queryResult.rows[0].id });
        } catch (err) {
            logger.error({ err }, INSERT_ERROR_MESSAGE);
            throw err;
        }
    }
);

// query dna
dnaRouter.get(
    '/',
    validateRetrieve,
    async (
        req: Request<
            never,
            Array<{ id: number; sequence: string }>,
            never,
            // levenstein distance is stringified number, since it's query param
            { sequence: string; levenshtein?: string }
        >,
        res
    ) => {
        const { sequence, levenshtein } = req.query;

        const query = sql`SELECT id, sequence FROM dna `;

        if (levenshtein) {
            query.append(sql`WHERE levenshtein(sequence, ${sequence})=${levenshtein} `);
        } else {
            query.append(sql`WHERE sequence LIKE ${`%${sequence}%`} `);
        }

        // sorting is always nice
        query.append(sql`ORDER BY sequence`);

        try {
            const queryResult = await db.query<{ id: number; sequence: string }>(query);
            return res.json(queryResult.rows);
        } catch (err) {
            logger.error({ err, sequence }, QUERY_ERROR_MESSAGE);
            throw err;
        }
    }
);

import { Router, Request } from 'express';
import sql from 'sql-template-strings';
import { db } from './db';
import { logger } from './logger';
import { validateAdd, validateRetrieve } from './middleware';

const INSERT_ERROR_MESSAGE = 'Cannot insert dna sequence';
const QUERY_ERROR_MESSAGE = 'Cannot query dna sequence';

export const dnaRouter = Router();

// NOTE: these are very simple examples with little bunsiness logic, so it's
// acceptable to call db from handlers. In case of futher development all
// db related functionality can easily be moved in respective file

// add dna string
dnaRouter.post(
  '/',
  validateAdd,
  // it's possible to infer body from validateAdd
  async (req: Request<never, { id: number }, { sequence: string }>, res) => {
    const { sequence } = req.body;
    let id;

    try {
      const queryResult = await db.query<{ id: number }>(
        sql`INSERT INTO dna(sequence) VALUES(${sequence}) RETURNING id`
      );
      id = queryResult.rows[0].id;
    } catch (err) {
      logger.error({ err }, INSERT_ERROR_MESSAGE);
      throw err;
    }

    return res.json({ id });
  }
);

// query dna
dnaRouter.get(
  '/',
  validateRetrieve,
  async (
    req: Request<
      never,
      Array<{ id: number; sequence: string }> | [],
      never,
      // levenstein distance is stringified number, since it's query param
      { sequence: string; levenshtein?: string }
    >,
    res
  ) => {
    const { sequence, levenshtein } = req.query;

    let retrievedRows;

    const query = sql`SELECT id, sequence FROM dna `;

    if (levenshtein) {
      query.append(sql`WHERE levenshtein(sequence, ${sequence})=${levenshtein} `);
    } else {
      query.append(sql`WHERE sequence LIKE ${`%${sequence}%`} `);
    }

    // sorting is always nice
    query.append(sql`ORDER BY sequence`);

    try {
      const { rows } = await db.query<{ id: number; sequence: string }>(query);
      retrievedRows = rows;
    } catch (err) {
      logger.error({ err, sequence }, QUERY_ERROR_MESSAGE);
      throw err;
    }

    return res.json(retrievedRows);
  }
);

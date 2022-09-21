import { rest } from 'msw';

export const records = [{ id: 1, sequence: 'ACTG' }, { id: 2, sequence: 'TCAG' }, { id: 3, sequence: 'GACT' }];

export const handlers = [
  rest.post('/api/dna', async (req, res, ctx) => {
    const body = await req.json()
    if (body.sequence === 'TACG') {
      return res(ctx.status(500), ctx.json({ message: 'Something went wrong' }));
    }

    return res(ctx.status(200), ctx.json({id: 2}));
  }),
  rest.get('api/dna', (req, res, ctx) => {
    const sequence = req.url.searchParams.get('sequence');
    const levenshtein = req.url.searchParams.get('levenshtein');

    if (sequence === 'TACGG') {
      return res(ctx.status(403), ctx.json({ message: 'Not valid!' }));
    }
    
    if (sequence === 'TACG') {
      return res(ctx.status(200), ctx.json([]));
    }

    if (levenshtein) {
      return res(ctx.status(200), ctx.json([records[0]]));
    }

    return res(ctx.status(200), ctx.json(records));
  }),
]

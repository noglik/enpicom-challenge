import { rest } from 'msw';

export const handlers = [
  rest.post('/api/dna', async (req, res, ctx) => {
    const body = await req.json()
    if (body.sequence === 'TACG') {
      return res(ctx.status(500), ctx.json({ message: 'Something went wrong' }));
    }

    return res(ctx.status(200), ctx.json({id: 2}));
  }),
]

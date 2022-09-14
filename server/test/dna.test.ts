import { expect } from 'chai';

describe('Dna router', function () {
    it('POST /api/dna should create dna record in db on', async function () {
        const sequence = 'ACTG';
        const res = await this.server.post('/api/dna').send({ sequence });

        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('number');
    });

    it('POST /api/dna should return 500 if sequence is too long', async function () {
        const sequence = 'ACTG'.repeat(64); // 256 length string
        const res = await this.server.post('/api/dna').send({ sequence });

        expect(res.status).to.be.eql(500);
        expect(res.body).to.be.eql({ message: 'Something went wrong' });
    });
});

import { expect } from 'chai';
import sql from 'sql-template-strings';
import { db } from '../src/db';
import { INCORRECT_LENGTH, REGEX_FAIL, NOT_A_NUMBER } from '../src/middleware';

describe('Dna router', function () {
    // table can be cleaned in afterEach, but since there are no a lot of tests it's fine

    describe('POST /api/dna save', function () {
        it('should create dna record in db on', async function () {
            const sequence = 'ACTG';
            const res = await this.server.post('/api/dna').send({ sequence });

            expect(res.status).to.be.eql(200);
            expect(res.body).to.have.property('id');
            expect(res.body.id).to.be.a('number');
        });

        it('should return 500 if sequence is too long(256 chars)', async function () {
            const sequence = 'ACTG'.repeat(64); // 256 length string
            const res = await this.server.post('/api/dna').send({ sequence });

            expect(res.status).to.be.eql(400);
            expect(res.body).to.be.eql({ message: INCORRECT_LENGTH });
        });
    });

    describe('GET /api/dna query', function () {
        it('should query already existing dna sequences', async function () {
            const { rows } = await db.query(
                sql`INSERT INTO dna(sequence) VALUES('TCAGTCAG'), ('ACTGTCAG') RETURNING id, sequence`
            );

            const res = await this.server.get('/api/dna').query({ sequence: 'TCAG' });

            expect(res.status).to.be.eql(200);
            expect(res.body).to.be.eql(rows.reverse()); // check ordering too
        });

        it("should return empty array if pattern doesn't match", async function () {
            const res = await this.server.get('/api/dna').query({ sequence: 'CAGTACGTTCAG' });

            expect(res.status).to.be.eql(200);
            expect(res.body).to.be.eql([]);
        });

        it('should return return 400 if sequence has incorrect value("ABRACADABRA")', async function () {
            const res = await this.server.get('/api/dna').query({ sequence: 'ABRACADABRA' });

            expect(res.status).to.be.eql(400);
            expect(res.body).to.be.eql({ message: REGEX_FAIL });
        });

        describe('with Levenshtein distance', function () {
            it('should query sequnce with levenshtein distance 2', async function () {
                const { rows } = await db.query(
                    sql`INSERT INTO dna(sequence) VALUES('GACTACTG') RETURNING id, sequence`
                );

                const res = await this.server
                    .get('/api/dna')
                    .query({ sequence: 'GACTACCC', levenshtein: 2 });

                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.eql(rows);
            });

            it('should return empty array if there are no matches for given distance', async function () {
                const res = await this.server
                    .get('/api/dna')
                    .query({ sequence: 'CAGTA', levenstein: 1 });

                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.eql([]);
            });

            it('should return return 400 if levenshtein distance is not a number', async function () {
                const res = await this.server
                    .get('/api/dna')
                    .query({ sequence: 'CAGTA', levenstein: 'not_a_number' });

                expect(res.status).to.be.eql(400);
                expect(res.body).to.be.eql({ message: NOT_A_NUMBER });
            });
        });
    });
});

import { expect } from 'chai';

describe('Application', function () {
    it('should handle GET /api/health requests', async function () {
        const res = await this.server.get('/api/health');
        expect(res.status).to.be.eql(200);
        expect(res.body).to.be.eql({ status: 'OK' });
    });
});

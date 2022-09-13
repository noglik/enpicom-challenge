import { expect } from 'chai';

describe('Application', function () {
    it('should handle GET /api/health requests', async function () {
        expect(this.server.get('/api/health')).to.eventually.be.eql({ status: 'OK' });
    });
});

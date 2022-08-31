import chai, { expect } from 'chai';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { createServer } from './app';

describe('Application', () => {
    let serverInstance: Server;
    let server: ChaiHttp.Agent;

    before(() => {
        serverInstance = createServer().listen();
        const address = serverInstance.address as unknown as AddressInfo;
        const localUrl = `http://localhost:${address.port}`;
        server = chai.request(localUrl);
    });

    after(() => {
        serverInstance.close();
    });

    it('should handle GET /api/health requests', async () => {
        expect(server.get('/api/health')).to.eventually.be.eql({ status: 'OK' });
    });
});

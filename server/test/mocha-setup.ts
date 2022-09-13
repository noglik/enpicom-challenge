import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import { createServer } from '../src/app';
import { AddressInfo, Server } from 'net';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

declare module 'mocha' {
    export interface Context {
        serverInstance: Server;
        server: ChaiHttp.Agent;
    }
}

before(function () {
    this.serverInstance = createServer().listen();
    const address = this.serverInstance.address as unknown as AddressInfo;
    const localUrl = `http://localhost:${address.port}`;
    this.server = chai.request(localUrl);
});

after(function () {
    this.serverInstance.close();
});

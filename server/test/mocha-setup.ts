import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import { AddressInfo, Server } from 'net';
import { GenericContainer } from 'testcontainers';
import { createServer } from '../src/app';
import { setup as setupDb, close as closeDb } from '../src/db';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

declare module 'mocha' {
    export interface Context {
        serverInstance: Server;
        server: ChaiHttp.Agent;
        container: Awaited<ReturnType<GenericContainer['start']>>;
    }
}

const DB_NAME = 'enpicom';
const DB_PASSWORD = 'password';
const PORT = 5432;

before(async function () {
    this.timeout(20000);
    this.container = await new GenericContainer('postgres:14.5-alpine')
        .withExposedPorts(PORT)
        .withEnv('POSTGRES_DB', DB_NAME)
        .withEnv('POSTGRES_PASSWORD', DB_PASSWORD)
        .start();

    const host = this.container.getHost();
    const port = this.container.getMappedPort(PORT);

    setupDb(`postgres://postgres:${DB_PASSWORD}@${host}:${port}/${DB_NAME}`);

    this.serverInstance = createServer().listen();
    const address = this.serverInstance.address as unknown as AddressInfo;
    const localUrl = `http://localhost:${address.port}`;
    this.server = chai.request(localUrl);
});

after(function () {
    this.serverInstance.close();
    closeDb();
    this.container.stop();
});

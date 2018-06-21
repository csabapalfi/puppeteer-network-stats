const EventEmitter = require('events');
const test = require('tape');
const {stub} = require('sinon');
const {execSync: exec} = require('child_process');

test('PuppeteerNetworkStats', async (t) => {
    t.plan(6);

    const PuppeteerNetworkStats = require('./index');

    const mockClient = new EventEmitter();
    mockClient.send = stub();
    mockClient.detach = stub();

    const createCDPSession = stub().returns(mockClient);
    const mockPage = {target: () => ({createCDPSession})};

    const networkStats = new PuppeteerNetworkStats();

    await networkStats.attach(mockPage);
    t.ok(createCDPSession.calledOnce, 'attach creates client');
    t.ok(mockClient.send.calledWith('Network.enable'), 'attach enables Network');

    const requestId = 1;
    const type = 'Document';
    const url = 'http://example.com';
    mockClient.emit('Network.requestWillBeSent', {requestId, type, request: {url}});
    t.deepEqual(networkStats.getStats()[0], {url, type}, 'url and type captured from requestWillBeSent');

    const status = 200;
    mockClient.emit('Network.responseReceived', {requestId, response: {status}});
    t.deepEqual(networkStats.getStats()[0].status, status, 'status captured from responseReceived');

    const size = 200;
    mockClient.emit('Network.loadingFinished', {requestId, encodedDataLength: size});
    t.deepEqual(networkStats.getStats()[0].size, size, 'size captured from loadingFinished');

    await networkStats.detach(mockPage);
    t.ok(mockClient.detach.calledOnce, 'detach calls client.detach');
});

test('run', async (t) => {
    t.plan(2);

    const scriptOutput = JSON.parse(exec('node run.js https://www.google.com'));
    t.ok(scriptOutput.length > 0, 'runs as a script');

    const run = require('./run');
    const moduleOutput = await run('https://www.google.com');
    t.ok(moduleOutput.length > 0, 'runs as a module');
});
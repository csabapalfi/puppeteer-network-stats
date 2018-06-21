const EventEmitter = require('events');
const test = require('tape');
const {stub} = require('sinon');

test('PuppeteerNetworkStats', async (t) => {
    t.plan(6);

    const PuppeteerNetworkStats = require('./index');

    const mockClient = new EventEmitter();
    mockClient.send = stub();
    mockClient.detach = stub();

    const createCDPSession = stub().returns(mockClient);
    const mockPage = {target: () => ({createCDPSession})};

    const networkStats = new PuppeteerNetworkStats({
        requestWillBeSent: ({request: {url}}) => ({url}),
        responseReceived: ({response: {status}}) => ({status})
    });

    await networkStats.attach(mockPage);
    t.ok(
        createCDPSession.calledOnce,
        'attach creates client'
    );
    t.ok(
        mockClient.send.calledWith('Network.enable'),
        'attach enables Network'
    );

    const id = 1;
    const url = 'https://www.example.com';
    mockClient.emit(
        'Network.requestWillBeSent',
        {requestId: id, request: {url}}
    );
    t.equal(
        networkStats.getRequests()[id].url, url,
        'configured parameters are captured from an event'
    );

    const status = 200;
    mockClient.emit(
        'Network.responseReceived',
        {requestId: id, response: {status}}
    );
    t.deepEqual(
        networkStats.getRequests()[id], {status, url},
        'event with same request id has its captured parameters merged'
    );

    await networkStats.detach(mockPage);
    t.ok(mockClient.detach.calledOnce, 'detach calls client.detach');

    networkStats.clearRequests();
    t.deepEqual(
        networkStats.getRequests(), {},
        'clearRequests clears captured requests'
    );

});
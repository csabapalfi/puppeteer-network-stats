const {entries} = Object;

const defaults = {
    requestWillBeSent: ({type, request: {url}}) => ({type, url}),
    responseReceived: ({response: {status}}) => ({status}),
    loadingFinished: ({encodedDataLength: size}) => ({size}),
};

class PuppeteerNetworkStats {

    constructor(config = {}) {
        this.config = {...defaults, ...config};
        this.stats = {};
    }

    onEvent(capture, {requestId, ...params}) {
        this.stats[requestId] = {
            ...this.stats[requestId],
            ...capture(params)
        };
    }

    getStats() {
        return entries(this.stats).map(([,value]) => value);
    }

    async attach(page) {
        this.client = await page.target().createCDPSession();
        await this.client.send('Network.enable');
        for (let [event, capture] of entries(this.config)) {
            const callback = this.onEvent.bind(this, capture);
            await this.client.on(`Network.${event}`, callback);
        }
    }

    async detach() {
        await this.client.detach();
    }
}

module.exports = PuppeteerNetworkStats;
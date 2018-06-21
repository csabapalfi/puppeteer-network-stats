class PuppeteerNetworkStats {

    constructor(config) {
        this.config = config;
        this.requests = {};
    }

    onEvent(capture, {requestId: id, ...params}) {
        this.requests[id] = {
            ...this.requests[id],
            ...capture(params)
        };
    }

    getRequests() {
        return this.requests;
    }

    clearRequests() {
        this.requests = {};
    }

    async attach(page) {
        this.client = await page.target().createCDPSession();
        await this.client.send('Network.enable');
        for (let [event, capture] of Object.entries(this.config)) {
            const callback = this.onEvent.bind(this, capture);
            await this.client.on(`Network.${event}`, callback);
        }
    }

    async detach() {
        await this.client.detach();
    }
}

module.exports = PuppeteerNetworkStats;
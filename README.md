<!-- markdownlint-disable MD026 -->

# Puppeteer Network Stats

[![Build Status](https://travis-ci.org/csabapalfi/puppeteer-network-stats.svg?branch=master)](https://travis-ci.org/csabapalfi/puppeteer-network-stats/)
[![Coverage Status](https://coveralls.io/repos/github/csabapalfi/puppeteer-network-stats/badge.svg)](https://coveralls.io/github/csabapalfi/puppeteer-network-stats)

Attach to a puppeteer page and collect network request stats.

## Install

```sh
npm install puppeteer-network-stats
```

## Usage

Example below:

* captures data for all requests

* request URLs based on the `Network.requestWillBeSent` event

* response status based on the `Network.responseReceived` event

* all event data is merged based on request ids

```js
const PuppeteerNetworkStats = require('puppeteer-network-stats');

const config = {
  requestWillBeSent: ({request: {url}}) => ({url}),
  responseReceived: ({response: {status}}) => ({status})
};

const networkStats = new PuppeteerNetworkStats(config);

// const browser = await puppeteer.launch();
// const page = browser.newPage();

await networkStats.attach(page); // creates CDP session, registers listeners

// await page.goto(url);

networkStats.getRequests(); // gives you an map of all request data by id

networkStats.clearRequests(); // clears all captured requests

await networkStats.detach(page); // detaches CDP session
```

A similar configuration allows capturing data from any [Network.*](https://chromedevtools.github.io/devtools-protocol/tot/Network#event-dataReceived) events.

As an example for debugging we can just log all event data easily:

```js
const config = [
  'requestWillBeSent',
  'requestServedFromCache',
  'loadingFinished',
  'loadingFailed',
  'responseReceived'
].map(
  (event) => ({
    [event]: (params) => ({[event]: params})
  })
).reduce(
  (result, item) => ({...result, ...item}), {}
)
```
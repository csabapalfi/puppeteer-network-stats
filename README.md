<!-- markdownlint-disable MD026 -->

# Puppeteer Network Stats

[![Build Status](https://travis-ci.org/csabapalfi/puppeteer-network-stats.svg?branch=master)](https://travis-ci.org/csabapalfi/puppeteer-network-stats/)
[![Coverage Status](https://coveralls.io/repos/github/csabapalfi/puppeteer-network-stats/badge.svg)](https://coveralls.io/github/csabapalfi/puppeteer-network-stats)

Attach to a puppeteer page and collect network stats.

## Install

```sh
npm install puppeteer-network-stats
```

## Usage - cli

Requires puppeteer to be installed globally, then:

```sh
puppeteer-network-stats <url>
```

e.g.

```sh
npm install --global puppeteer puppeteer-network-stats
puppeteer-network-stats https://www.google.com | jq .
[
  {
    "type": "Document",
    "url": "https://www.google.com/",
    "status": 200,
    "size": 72313
  },
  ...
```

## Usage - module

You can just require the run function (that's also used for the cli).

```js
const run = require('puppeteer-network-stats/run');
console.log(await run('https://www.google.com'));
```

If you want to interact with your page, etc:

```js
const PuppeteerNetworkStats = require('puppeteer-network-stats');
const networkStats = new PuppeteerNetworkStats();
await networkStats.attach(page);
// ... goto a page, etc
networkStats.getStats() // gives you an array of all requests
```

It's also easy to capture data from any [Network.*](https://chromedevtools.github.io/devtools-protocol/tot/Network#event-dataReceived) event.

e.g. to capture mimeType, too

```js
const networkStats = new PuppeteerNetworkStats({
    responseReceived:
        ({response: {status, mimeType}}) =>
            ({status, mimeType}),
});
```

## Caveats

* The default config doesn't handle `requestServedFromCache` and `loadingFailed` events.
* Overriding data capture for an event type completely overrides fields captured by default.

## Why not just build HAR files or use `puppeteer-har`?

See [sitespeedio/chrome-har#15](https://github.com/sitespeedio/chrome-har/issues/15). It's not trivial to build HAR from just network events hence this minimalist module that's not concerned with the specific HAR format.
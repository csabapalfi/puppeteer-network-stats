# Puppeteer Network Stats

Attach to a puppeteer [`Target`](https://pptr.dev/#?product=Puppeteer&version=v1.5.0&show=api-class-target) (e.g. `page.target()`) and collect network stats.

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

```js
const networkStats = new PuppeteerNetworkStats();
await networkStats.attach(page.target());
// ... goto a page, etc
networkStats.getStats() // gives you an array of all requests
```

By default it only captures `url`, `type`, `status` and `size` but easy to configure to capture data from any [Network.*](https://chromedevtools.github.io/devtools-protocol/tot/Network#event-dataReceived) event.

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
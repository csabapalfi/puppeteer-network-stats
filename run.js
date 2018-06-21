#!/usr/bin/env node

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const PuppeteerNetworkStats = require('./index');

async function run(url, deviceName) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const device = devices[deviceName];
  if (device) {
    page.emulate(device);
  }

  await page.setCacheEnabled(false);
  const networkStats = new PuppeteerNetworkStats();
  await networkStats.attach(page);

  await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});

  await networkStats.detach();
  await browser.close();

  return {
    url,
    device,
    requests: networkStats.getStats()
  };
}

if (require.main === module) {
  (async () => {
    const [,,url, deviceName] = process.argv;
    console.log(JSON.stringify(await run(url, deviceName), null, 2));
  })();
}

module.exports = run;


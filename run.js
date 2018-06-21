#!/usr/bin/env node

const puppeteer = require('puppeteer');
const PuppeteerNetworkStats = require('./index');

async function run(url) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setCacheEnabled(false);
  const networkStats = new PuppeteerNetworkStats();
  await networkStats.attach(page);

  await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});

  await networkStats.detach();
  await browser.close();

  return networkStats.getStats();
}

if (require.main === module) {
  (async () => {
    const [,,url] = process.argv;
    console.log(JSON.stringify(await run(url), null, 2));
  })();
}

module.exports = run;


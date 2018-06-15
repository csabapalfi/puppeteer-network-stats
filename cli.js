#!/usr/bin/env node

const puppeteer = require('puppeteer');
const PuppeteerNetworkStats = require('./index');
const [,,url] = process.argv;

(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.setCacheEnabled(false);
    const networkStats = new PuppeteerNetworkStats();
    await networkStats.attach(page);

    await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});

    console.log(JSON.stringify(networkStats.getStats(), null, 2));

    await networkStats.detach();
    await browser.close();
  })();
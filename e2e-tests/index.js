const { connect } = require('near-api-js'); 

const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto('https://wallet.near.org/');
  await page.screenshot({ path: `example.png` });
  await browser.close();
})();
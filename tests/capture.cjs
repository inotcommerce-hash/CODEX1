const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium', args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 480 } });
    const externalRequests = [];
    await page.route('**/*', route => {
      if (new URL(route.request().url()).hostname !== '127.0.0.1') {
        externalRequests.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    await page.goto('http://127.0.0.1:8000');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.header-logo').evaluate(image => image.complete && image.naturalWidth > 0), true);
    await page.screenshot({ path: 'tests/artifacts/overview.png' });
    await page.click('#start');
    await page.getByRole('heading', { name: 'Press dwell', exact: true }).waitFor();
    await page.screenshot({ path: 'tests/artifacts/overview-running.png' });
    await page.click('#stop');
    await page.click('nav [data-page="manual"]');
    await page.click('#mode-toggle');
    await page.screenshot({ path: 'tests/artifacts/manual.png' });
    await page.click('nav [data-page="settings"]');
    await page.selectOption('#access', 'Engineer');
    await page.screenshot({ path: 'tests/artifacts/diagnostics.png' });
    await page.click('#fault-guard');
    await page.click('#alarm-link');
    await page.screenshot({ path: 'tests/artifacts/alarms.png' });
    assert.deepEqual(externalRequests, [], 'The prototype must use local runtime assets only');
    console.log('Captured five screens at 800×480; original logo and fonts work without external network access.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});

const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 480 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8000');
    await page.evaluate(() => document.fonts.ready);

    await assertPanel();
    await page.screenshot({ path: 'tests/artifacts/overview.png' });
    await page.click('.recipe-pill');
    assert.equal(await page.locator('#recipe').isDisabled(), true);
    await page.click('nav [data-page="overview"]');

    await page.click('#start');
    await page.waitForTimeout(8000);
    assert.match(await page.locator('.metrics').innerText(), /1\nGOOD PARTS/);

    // Live machine updates must not replace a field while the operator uses it.
    await page.click('nav [data-page="settings"]');
    await page.locator('#access').focus();
    await page.waitForTimeout(300);
    assert.equal(
      await page.locator('#access').evaluate(element => document.activeElement === element),
      true,
      'The access selector must retain focus during automatic operation',
    );
    await assertPanel();
    await page.click('nav [data-page="overview"]');
    await page.click('#stop');
    assert.match(await page.locator('#status').innerText(), /READY/);

    await page.click('nav [data-page="manual"]');
    await page.click('#mode-toggle');
    const jog = page.locator('[data-hold="infeed"]');
    await jog.hover();
    await page.mouse.down();
    assert.match(await page.locator('#content').innerText(), /Command ON \/ Feedback RUN/);
    await page.mouse.up();
    assert.match(await page.locator('#content').innerText(), /Command OFF \/ Feedback STOP/);

    await page.locator('[data-hold="press"]').hover();
    await page.mouse.down();
    assert.match(await page.locator('#content').innerText(), /Actual LOWER/);
    await page.mouse.up();
    assert.match(await page.locator('#content').innerText(), /Actual UPPER/);

    // A second actuator and keyboard release exercise the stable hold controls.
    const outfeed = page.locator('[data-hold="outfeed"]');
    await outfeed.focus();
    await page.keyboard.down(' ');
    await page.waitForTimeout(200);
    assert.match(await page.locator('#feedback-outfeed').innerText(), /Command ON/);
    await page.keyboard.up(' ');
    assert.match(await page.locator('#feedback-outfeed').innerText(), /Command OFF/);
    await outfeed.hover();
    await page.mouse.down();
    await outfeed.dispatchEvent('pointercancel');
    await page.mouse.up();
    assert.match(await page.locator('#feedback-outfeed').innerText(), /Command OFF/);

    await jog.hover();
    await page.mouse.down();
    await page.locator('[data-hold="press"]').dispatchEvent('pointerdown', { pointerId: 2 });
    assert.match(await page.locator('#toast').innerText(), /Interlock/);
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.mouse.up();
    assert.match(await page.locator('#content').innerText(), /Command OFF \/ Feedback STOP/);
    await page.waitForTimeout(2900);
    await assertPanel();
    await page.screenshot({ path: 'tests/artifacts/manual.png' });

    await page.click('nav [data-page="settings"]');
    await page.selectOption('#access', 'Engineer');
    await page.selectOption('#recipe', 'Delicate');
    assert.equal(await page.inputValue('#dwell'), '1.8');
    await page.fill('#dwell', '2');
    await page.locator('#dwell').dispatchEvent('change');
    assert.equal(await page.inputValue('#dwell'), '2');

    await page.click('#fault-guard');
    assert.match(await page.locator('#status').innerText(), /FAULT/);
    await page.click('#reset');
    assert.match(await page.locator('#toast').innerText(), /Restore/);
    await page.click('nav [data-page="alarms"]');
    await page.click('[data-ack]');
    assert.equal(await page.locator('[data-ack]').isDisabled(), true);
    await assertPanel();
    await page.screenshot({ path: 'tests/artifacts/alarms.png' });

    await page.click('nav [data-page="settings"]');
    await page.click('#clear-fault');
    await page.click('#reset');
    assert.match(await page.locator('#status').innerText(), /MANUAL/);
    await page.waitForTimeout(2900);
    await assertPanel();
    await page.screenshot({ path: 'tests/artifacts/diagnostics.png' });

    await page.click('nav [data-page="alarms"]');
    await page.click('[data-tab="history"]');
    assert.match(await page.locator('.alarm-list').innerText(), /Cleared/);
    await page.click('[data-tab="active"]');
    assert.match(await page.locator('.alarm-list').innerText(), /No active alarms/);

    await page.click('nav [data-page="settings"]');
    await page.click('#fault-sensor');
    await page.click('nav [data-page="alarms"]');
    assert.match(await page.locator('.alarm-list').innerText(), /Part arrival timeout/);
    await page.click('[data-ack]');
    await page.click('nav [data-page="settings"]');
    await page.click('#clear-fault');
    await page.click('#reset');
    await page.click('nav [data-page="manual"]');
    await page.click('#mode-toggle');
    await page.click('nav [data-page="overview"]');
    assert.equal(await page.locator('#start').isEnabled(), true);
    assert.deepEqual(errors, []);

    console.log(
      'PASS: automatic cycle, count, stop, live-update focus persistence, manual jog/release, ' +
      'press feedback, outfeed keyboard/cancel, recipe/dwell, both faults, acknowledgement, reset, history, navigation, ' +
      '800×480 layout; no browser errors.',
    );

    async function assertPanel() {
      assert.deepEqual(
        await page.locator('#panel').evaluate(element => [element.clientWidth, element.clientHeight]),
        [800, 480],
      );
      assert.equal(
        await page.evaluate(() =>
          document.documentElement.scrollWidth <= 800 &&
          document.documentElement.scrollHeight <= 480),
        true,
      );

      const outside = await page.locator('main button, main input, main select').evaluateAll(elements => {
        const main = document.querySelector('main').getBoundingClientRect();
        const tolerance = 0.5;
        return elements
          .filter(element => {
            if (!element.getClientRects().length) return false;
            const bounds = element.getBoundingClientRect();
            return bounds.top < main.top - tolerance ||
              bounds.bottom > main.bottom + tolerance ||
              bounds.left < main.left - tolerance ||
              bounds.right > main.right + tolerance;
          })
          .map(element => element.outerHTML);
      });
      assert.deepEqual(outside, [], 'Main-screen controls must fit within the actual main bounds');
      const chromeOutside = await page.locator('header > *, footer button, nav button').evaluateAll(elements => elements.filter(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left < 0 || bounds.top < 0 || bounds.right > 800.5 || bounds.bottom > 480.5;
      }).map(element => element.outerHTML));
      assert.deepEqual(chromeOutside, [], 'Persistent controls and header must fit the panel');
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});

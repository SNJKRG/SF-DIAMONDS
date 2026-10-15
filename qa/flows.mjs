// Interaction checks against a running server: node qa/flows.mjs [baseUrl]
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const base = process.argv[2] ?? 'http://localhost:4173';
const shots = fileURLToPath(new URL('./shots/', import.meta.url));
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const results = [];
const check = async (name, fn) => {
  try { await fn(); results.push(['ok', name]); } catch (e) { results.push(['FAIL', name, e.message.split('\n')[0]]); }
};

// Mobile: menu, Escape returns focus, 320px layout.
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 568 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/ru/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${shots}ru-home-m320.png` });
  await check('320px: no horizontal overflow', async () =>
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0));
  await check('menu opens, Escape closes and returns focus', async () => {
    const btn = page.getByRole('button', { name: 'Меню' });
    await btn.click();
    assert.equal(await btn.getAttribute('aria-expanded'), 'true');
    await page.screenshot({ path: `${shots}ru-menu-m320.png` });
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button', { name: 'Меню' }).getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement?.className), 'menu-button');
  });
  await check('tap targets >= 44px in hero and header', async () => {
    const small = await page.$$eval('.site-header a, .site-header button, .hero a, .hero button', (els) =>
      els.filter((e) => e.offsetParent && e.getBoundingClientRect().height < 44).map((e) => e.textContent));
    assert.deepEqual(small, []);
  });
  await ctx.close();
}

// Desktop: keyboard, language switch, shortlist, compose form.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto(`${base}/ru/`, { waitUntil: 'networkidle' });

  await check('first Tab shows skip link, focus ring visible', async () => {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.className), 'skip');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    assert.equal(outline, 'solid');
    await page.screenshot({ path: `${shots}ru-home-d1440-focus.png` });
  });

  await check('demo prices: exact amounts, no currency, no strikethrough', async () => {
    const text = await page.locator('.rail').innerText();
    for (const n of ['90 000', '110 000', '115 000', '420 000', '325 000', '105 000', '460 000', '350 000'])
      assert.ok(text.replace(/ | /g, ' ').includes(n), n);
    assert.ok(!/[₽$€]|AED|руб/.test(text));
    assert.equal(await page.locator('.rail s, .rail del').count(), 0);
  });

  await check('product size kept in URL across language switch', async () => {
    await page.goto(`${base}/ru/pieces/ring-size-55`, { waitUntil: 'networkidle' });
    await page.getByRole('textbox', { name: 'Нужный размер' }).fill('16,5');
    await page.getByRole('group', { name: 'Язык' }).getByRole('link', { name: 'EN' }).click();
    await page.waitForURL(/\/en\/pieces\/ring-size-55\?size=16%2C5/);
    assert.equal(await page.getByRole('textbox', { name: 'Preferred size' }).inputValue(), '16,5');
    const href = await page.getByRole('link', { name: /Enquire about this piece/ }).getAttribute('href');
    assert.ok(decodeURIComponent(href).includes('16,5') && href.startsWith('https://wa.me/79254956265?text='));
  });

  await check('shortlist survives reload and language switch', async () => {
    await page.goto(`${base}/ru/collection`, { waitUntil: 'networkidle' });
    const saves = page.getByRole('button', { name: 'Сохранить в подборку' });
    for (let i = 0; i < 3; i++) await saves.first().click();
    assert.equal(await page.locator('.grid [aria-pressed="true"]').count(), 3);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.grid [aria-pressed="true"]').count(), 3);
    await page.goto(`${base}/en/shortlist`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.shortlist li').count(), 3);
    const msg = await page.locator('#msg').inputValue();
    assert.ok(msg.includes('Tennis necklace') && msg.includes('Halo stud earrings') && msg.includes('/en/pieces/'), msg);
    await page.screenshot({ path: `${shots}en-shortlist-filled-d1440.png`, fullPage: true });
  });

  await check('unknown shortlist id is labelled, not swapped', async () => {
    await page.evaluate(() => localStorage.setItem('sf-shortlist', JSON.stringify([{ id: 'retired-1', size: '' }])));
    await page.reload({ waitUntil: 'networkidle' });
    assert.ok((await page.locator('.shortlist').innerText()).includes('no longer in the collection'));
  });

  await check('viewing form: errors, optional fields, preview, no network send', async () => {
    await page.goto(`${base}/ru/viewing`, { waitUntil: 'networkidle' });
    const before = requests.length;
    await page.getByRole('button', { name: 'Подготовить сообщение в WhatsApp' }).click();
    assert.equal(await page.locator('.error').count(), 3);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'f-name');
    await page.screenshot({ path: `${shots}ru-viewing-errors-d1440.png`, fullPage: true });
    await page.fill('#f-name', 'Анна');
    await page.fill('#f-contact', '+7 900 000-00-00');
    await page.fill('#f-message', 'Кольцо, размер пока не знаю');
    await page.getByRole('button', { name: 'Подготовить сообщение в WhatsApp' }).click();
    const preview = await page.locator('#preview').inputValue();
    assert.ok(preview.includes('Анна') && !preview.includes('Бюджет'));
    assert.ok(!(await page.content()).includes('Запрос отправлен'));
    assert.equal(requests.slice(before).filter((u) => !u.startsWith(base)).length, 0);
    await page.screenshot({ path: `${shots}ru-viewing-preview-d1440.png`, fullPage: true });
  });

  await check('reduced motion: poster only, no WebGL chunk', async () => {
    const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const p = await rm.newPage();
    const urls = [];
    p.on('request', (r) => urls.push(r.url()));
    await p.goto(`${base}/en/`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    assert.equal(await p.locator('canvas').count(), 0);
    assert.ok(!urls.some((u) => u.includes('RingScene')));
    await rm.close();
  });

  await check('3D starts after load, no extra hero controls', async () => {
    await page.goto(`${base}/en/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.hero.is-live', { timeout: 30000 });
    assert.equal(await page.locator('.hero button').count(), 0);
  });

  await check('unknown routes: language prefix added, 404 page shown', async () => {
    await page.goto(`${base}/ru/does-not-exist`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').innerText(), 'Страница не найдена');
  });
  await ctx.close();
}
await browser.close();
for (const r of results) console.log(r.join(' | '));
process.exitCode = results.some((r) => r[0] === 'FAIL') ? 1 : 0;

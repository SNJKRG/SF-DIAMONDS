// Full-page screenshots of key routes for before/after comparison: node qa/regress.mjs <out-dir>
import { chromium } from 'playwright';
const out = process.argv[2];
const routes = ['/ru/', '/en/', '/ru/collection', '/ru/collection/bracelets?budget=gt200', '/ru/pieces/' , '/ru/bespoke', '/ru/about', '/ru/viewing', '/ru/shortlist', '/ru/faq'];
const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  for (const r of routes) {
    let url = r;
    if (r === '/ru/pieces/') { await page.goto('http://localhost:4173/ru/collection'); url = new URL(await page.locator('.card-name a').first().getAttribute('href'), 'http://x').pathname; }
    await page.goto('http://localhost:4173' + url, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'canvas{visibility:hidden!important}' }); // WebGL hero is not deterministic
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${tag}${r.replace(/[^a-z0-9]+/gi, '_')}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();

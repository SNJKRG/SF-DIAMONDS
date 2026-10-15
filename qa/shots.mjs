// Screenshots + basic checks against a running server: node qa/shots.mjs [baseUrl] [filter]
// Saves qa/shots/<locale>-<page>-<viewport>.png and prints console errors and horizontal overflow.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base = process.argv[2] ?? 'http://localhost:4173';
const only = process.argv[3];
const out = fileURLToPath(new URL('./shots/', import.meta.url));
mkdirSync(out, { recursive: true });

const pages = ['', 'collection', 'collection/watches', 'pieces/ring-size-55', 'shortlist', 'bespoke', 'engagement',
  'materials', 'about', 'service', 'availability', 'viewing', 'faq', 'contact', 'nope'];
const viewports = { d1440: [1440, 900], m390: [390, 844] };

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
let problems = 0;
for (const [vname, [width, height]] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  for (const lang of ['ru', 'en']) {
    for (const p of pages) {
      const name = `${lang}-${p.replaceAll('/', '_') || 'home'}-${vname}`;
      if (only && !name.includes(only)) continue;
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`${base}/${lang}/${p}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(p === '' ? 4000 : 400);
      // Scroll through so lazy images load before the full-page shot.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await page.screenshot({ path: `${out}${name}.png` });
      await page.screenshot({ path: `${out}${name}-full.png`, fullPage: true });
      if (overflow > 0 || errors.length) { problems++; console.log(name, { overflow, errors }); }
      await page.close();
    }
  }
  await ctx.close();
}
await browser.close();
console.log(problems ? `${problems} page(s) with problems` : 'no console errors, no horizontal overflow');

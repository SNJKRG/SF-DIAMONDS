// Hero ring: moves during the intro, still afterwards, follows the mouse. node qa/intro.mjs <out-dir>
import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4173/ru/', { waitUntil: 'networkidle' });
await p.waitForSelector('.hero.is-live', { timeout: 30000 });
const shot = async (n) => p.locator('.hero canvas').screenshot({ path: `${out}/i-${n}.png` });
for (const [n, ms] of [['a', 0], ['b', 1200], ['c', 1200], ['d', 3000], ['e', 2500]]) { await p.waitForTimeout(ms); await shot(n); }
await p.mouse.move(1400, 100, { steps: 10 }); await p.waitForTimeout(1500); await shot('f');
await b.close();

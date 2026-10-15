// Hero ring drag: lifts and turns while dragged, settles back after release. node qa/drag.mjs <out-dir>
import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4173/ru/', { waitUntil: 'networkidle' });
await p.waitForSelector('.hero.is-live', { timeout: 30000 });
await p.waitForTimeout(5500); // intro turn finished
await p.screenshot({ path: `${out}/d0-rest.png` });
await p.mouse.move(1050, 450); await p.mouse.down();
await p.mouse.move(1250, 380, { steps: 25 });
await p.waitForTimeout(300);
await p.screenshot({ path: `${out}/d1-drag.png` });
await p.mouse.up();
await p.waitForTimeout(600);
await p.screenshot({ path: `${out}/d2-spin.png` });
await p.waitForTimeout(5000);
await p.screenshot({ path: `${out}/d3-settled.png` });
await b.close();

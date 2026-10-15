// One capture frame: node qa/frame.mjs <out.png> <width> <height> <query>
import { chromium } from 'playwright';
const [out, w, h, q] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(`${process.env.BASE ?? 'http://localhost:4173'}/capture?${q}`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.__sceneReady === true, null, { timeout: 120000 });
await p.waitForTimeout(500);
await p.screenshot({ path: out });
await b.close();

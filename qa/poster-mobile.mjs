// Mobile hero poster from the same scene: node qa/poster-mobile.mjs <out.png>
import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const p = await b.newPage({ viewport: { width: 1170, height: 1056 } });
await p.goto('http://localhost:4173/capture?shot=01-hero-front&framing=portrait', { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.__sceneReady === true, null, { timeout: 120000 });
await p.waitForTimeout(500);
await p.screenshot({ path: process.argv[2] });
await b.close();

// Quick look renders of the 3D scene: node qa/look.mjs <out-dir> [query...]
import { chromium } from 'playwright';
const [out, ...queries] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
for (const q of queries) {
  await p.goto(`http://localhost:4173/capture?${q}`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__sceneReady === true, null, { timeout: 120000 });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/${q.replace(/[^a-z0-9]+/gi, '_')}.png` });
}
await b.close();

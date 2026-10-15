// Exports the five Gemini reference frames from the one 3D scene (/capture route).
// node qa/capture.mjs [baseUrl] [width] [height] [outDir] [framing]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const [base = 'http://localhost:4173', w = '2560', h = '1440', outArg, framing = 'landscape'] = process.argv.slice(2);
const out = outArg || fileURLToPath(new URL('../../sf-diamonds-handoff 2/assets/scene-renders/', import.meta.url));
mkdirSync(out, { recursive: true });
const shots = ['01-hero-front', '02-side-profile', '03-top-facets', '04-setting-macro'];
const suffix = framing === 'portrait' ? '-portrait' : '';

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const meta = { scene: 'site/src/three', version: null, width: +w, height: +h, framing, colorSpace: 'sRGB', exposure: 1, files: [] };
for (const shot of shots) {
  await page.goto(`${base}/capture?shot=${shot}&framing=${framing}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__sceneReady === true, null, { timeout: 120000 });
  await page.waitForTimeout(500);
  const file = `${out}${shot}${suffix}.png`;
  await page.screenshot({ path: file });
  meta.files.push({ shot, file: `${shot}${suffix}.png`, sha256: createHash('sha256').update(readFileSync(file)).digest('hex') });
}
// 05 is a byte-identical copy of 01 so the loop closes exactly (motion-storyboard.md).
copyFileSync(`${out}01-hero-front${suffix}.png`, `${out}05-loop-return${suffix}.png`);
meta.files.push({ shot: '05-loop-return', file: `05-loop-return${suffix}.png`, copyOf: `01-hero-front${suffix}.png`, sha256: meta.files[0].sha256 });
meta.version = await page.evaluate(() => window.__sceneVersion ?? null);
meta.presets = await page.evaluate(() => window.__scenePresets ?? null);
writeFileSync(`${out}metadata${suffix}.json`, JSON.stringify(meta, null, 2));
await browser.close();
console.log('saved', meta.files.map((f) => f.file).join(', '), 'to', out);

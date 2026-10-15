// Renders the 3D motion guide (motion.html) frame by frame and encodes it with ffmpeg.
// node qa/motion.mjs [baseUrl] [out.mp4] [fps] [--still t]
import { chromium } from 'playwright';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const still = args.includes('--still') ? +args.splice(args.indexOf('--still'), 2)[1] : null;
const [base = 'http://localhost:5179', out = 'motion-guide.mp4', fps = '24'] = args;

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(`${base}/motion.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
const canvas = page.locator('canvas');

if (still !== null) {
  await page.evaluate((t) => window.__render(t), still);
  await canvas.screenshot({ path: out });
} else {
  const dir = mkdtempSync(join(tmpdir(), 'motion-'));
  const n = Math.round((await page.evaluate(() => window.__duration)) * +fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.__render(t), i / +fps);
    await canvas.screenshot({ path: join(dir, `f${String(i).padStart(4, '0')}.png`) });
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', join(dir, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', out]);
  rmSync(dir, { recursive: true });
}
await browser.close();
console.log('saved', out);

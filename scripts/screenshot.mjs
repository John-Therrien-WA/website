import { chromium } from 'playwright';

const targets = [
  { url: 'http://127.0.0.1:4000/', out: '/tmp/wa-home.png' },
  { url: 'http://127.0.0.1:4000/magisches-theater.html', out: '/tmp/wa-mt.png' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

for (const { url, out } of targets) {
  const res = await page.goto(url, { waitUntil: 'networkidle' });
  console.log(`[BATCH] GET ${url} -> HTTP ${res.status()}`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`[BATCH] Wrote ${out}`);
}

await browser.close();

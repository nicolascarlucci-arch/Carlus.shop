import { chromium } from 'playwright';

// Usage: node shot.mjs <url> <outPath> [width] [height] [--mobile]
const [, , url, outPath, widthArg, heightArg, ...rest] = process.argv;
const isMobile = rest.includes('--mobile');
const width = Number(widthArg) || (isMobile ? 390 : 1440);
const height = Number(heightArg) || (isMobile ? 844 : 1000);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: isMobile ? 3 : 1,
  isMobile,
  hasTouch: isMobile,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(String(err)));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: outPath, fullPage: true });

if (errors.length) {
  console.log('CONSOLE ERRORS:');
  for (const e of errors) console.log(' -', e);
} else {
  console.log('no console errors');
}
console.log('saved', outPath, `${width}x${height}`, isMobile ? '(mobile emulation)' : '');

await browser.close();

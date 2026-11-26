import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('Geist is self-hosted, uses font-display, and is preloaded', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/font-optimization')).text();
  const preload = html.match(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/)?.[0];
  expect(preload, 'preload link for a font').toBeTruthy();
  const preloadHref = preload!.match(/href="([^"]+)"/)![1];
  expect(preloadHref).toMatch(/^\/assets\/geist-latin-.*\.woff2$/);
  expect(html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  const faces = [...html.matchAll(/@font-face\{[^}]*\}/g)].map((m) => m[0]);
  const geist = faces.filter((f) => f.includes('Geist Variable'));
  expect(geist.length).toBeGreaterThan(0);
  expect(geist.every((f) => /font-display:\s*swap/.test(f))).toBe(true);

  const fontRequests: string[] = [];
  page.on('request', (r) => r.resourceType() === 'font' && fontRequests.push(r.url()));
  await page.goto('/feature-tests/font-optimization');
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => document.fonts.check('16px "Geist Variable"'));
  expect(loaded).toBe(true);
  expect(fontRequests.length).toBeGreaterThan(0);
  expect(fontRequests.every((u) => new URL(u).host === 'localhost:' + new URL(page.url()).port)).toBe(true);
  const res = await request.get(preloadHref);
  expect(res.ok()).toBe(true);
  evidence(
    `preload ${preloadHref}; ${geist.length} Geist @font-face with font-display:swap; ${fontRequests.length} font requests, all same-origin; no Google Fonts`,
  );
});

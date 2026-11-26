import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

const SRC = '/feature-tests/fake-third-party.js';

test('stand-in third-party script loads after load+idle, not parser-blocking', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/third-party-scripts')).text();
  expect(html).not.toContain(`src="${SRC}"`);
  const head = html.split('</head>')[0];
  const blocking = [...head.matchAll(/<script(?![^>]*type="module")(?![^>]*\b(async|defer)\b)[^>]*\bsrc=/g)];
  expect(blocking).toEqual([]);

  let requestedAt = 0;
  page.on('request', (r) => {
    if (r.url().endsWith(SRC)) requestedAt = Date.now();
  });
  await page.goto('/feature-tests/third-party-scripts');
  const loadEnd = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return nav.loadEventEnd ? performance.timeOrigin + nav.loadEventEnd : 0;
  });
  await expect.poll(() => page.evaluate(() => (window as any).__fakeThirdParty?.readyState)).toBe('complete');
  expect(requestedAt).toBeGreaterThan(0);
  const loadEnd2 = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return performance.timeOrigin + nav.loadEventEnd;
  });
  expect(requestedAt).toBeGreaterThanOrEqual(Math.floor(loadEnd || loadEnd2) - 5);
  evidence(`no <script src> for it in server HTML; requested ${Math.round(requestedAt - loadEnd2)}ms after loadEventEnd; global set with document.readyState=complete`);
});

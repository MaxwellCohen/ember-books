import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('hovering a book link fetches its data before the click', async ({
  page,
}) => {
  const log: { url: string; t: number }[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).pathname.startsWith('/api/books/'))
      log.push({ url: r.url(), t: Date.now() });
  });
  await page.goto('/feature-tests/route-prefetching');
  await page.waitForFunction(() =>
    document.documentElement.innerHTML.includes('data-book-id'),
  );
  // Wait for the app to boot (rehydration attaches modifiers).
  await page.waitForLoadState('networkidle');

  const link = page.locator('a[data-book-id]').first();
  const id = await link.getAttribute('data-book-id');
  expect(log).toEqual([]);
  await link.hover();
  await expect.poll(() => log.length).toBe(1);
  expect(new URL(log[0].url).pathname).toBe(`/api/books/${id}`);
  const hoveredAt = log[0].t;

  await page.waitForTimeout(300);
  const clickAt = Date.now();
  await link.click();
  await expect(page).toHaveURL(new RegExp(`/${id}(\\?|$)`));
  await page.waitForLoadState('networkidle');
  expect(hoveredAt).toBeLessThan(clickAt);
  expect(log.length, 'model hook reused the prefetched promise').toBe(1);
  evidence(
    `hover fired GET /api/books/${id} ${clickAt - hoveredAt}ms before click; no second request after navigation (${log.length} total)`,
  );
});

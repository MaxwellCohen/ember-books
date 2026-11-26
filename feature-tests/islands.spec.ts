import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

const MARKER = 'STATIC_BLURB_MARKER_e8b14c';

test('static component ships no JS; the island hydrates and works', async ({ page }) => {
  const scripts: { url: string; body: string }[] = [];
  page.on('response', async (res) => {
    if (res.request().resourceType() === 'script') scripts.push({ url: res.url(), body: await res.text() });
  });
  await page.goto('/feature-tests/islands');
  await expect(page.getByTestId('static-blurb')).toContainText(MARKER);
  await expect(page.locator('[data-island-mounted="true"]')).toHaveCount(1);
  const button = page.getByTestId('island-button');
  await expect(button).toHaveText('Save Dune');
  await button.click();
  await expect(button).toHaveText('Saved Dune');
  await page.waitForLoadState('networkidle');

  expect(scripts.length).toBeGreaterThan(0);
  expect(scripts.filter((s) => s.body.includes(MARKER)).map((s) => s.url)).toEqual([]);
  expect(scripts.some((s) => /\/assets\/main-/.test(s.url))).toBe(false);

  // Sanity: the full app bundle does contain the marker, so the check above is meaningful.
  const html = await (await page.request.get('/feature-tests/css-inlining')).text();
  const main = html.match(/src="(\/assets\/main-[^"]+\.js)"/)![1];
  expect(await (await page.request.get(main)).text()).toContain(MARKER);
  const bytes = scripts.reduce((n, s) => n + s.body.length, 0);
  evidence(
    `island toggled Save→Saved via renderComponent; ${scripts.length} JS files (${bytes} B) loaded, none contain the static marker; main app bundle (${main}) not loaded`,
  );
});

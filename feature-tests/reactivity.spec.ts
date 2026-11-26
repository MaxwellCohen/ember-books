import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('@tracked updates only the bound text; template render runs once', async ({ page }) => {
  await page.goto('/feature-tests/reactivity');
  await page.waitForLoadState('networkidle');
  await expect.poll(() => page.evaluate(() => (window as any).__ftRenderCount)).toBe(1);
  const countNode = await page.getByTestId('count').evaluateHandle((el) => el);
  for (let i = 0; i < 3; i++) await page.getByTestId('increment').click();
  await expect(page.getByTestId('count')).toHaveText('3');
  expect(await page.evaluate(() => (window as any).__ftRenderCount)).toBe(1);
  await expect(page.getByTestId('renders')).toHaveText('1');
  const sameNode = await page.getByTestId('count').evaluate((el, prev) => el === prev, countNode);
  expect(sameNode).toBe(true);
  evidence('3 clicks: count text 0→3 in the same DOM node; render counter stayed at 1 (template helper not re-run)');
});

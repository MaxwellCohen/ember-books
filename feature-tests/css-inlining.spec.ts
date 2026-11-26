import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('route CSS is inlined in a <style> and no stylesheet <link> blocks render', async ({
  page,
  request,
}) => {
  const html = await (await request.get('/feature-tests/css-inlining')).text();
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(
    (m) => m[1],
  );
  const inlined = styles.find((css) => css.includes('.ft-css-inlining-marker'));
  expect(inlined, 'inline <style> contains the route marker rule').toBeTruthy();
  const blocking = [
    ...html.matchAll(/<link[^>]+rel="?stylesheet"?[^>]*>/g),
  ].map((m) => m[0]);
  expect(blocking, 'no render-blocking stylesheet links').toEqual([]);

  const cssRequests: string[] = [];
  page.on(
    'request',
    (r) => r.resourceType() === 'stylesheet' && cssRequests.push(r.url()),
  );
  await page.goto('/feature-tests/css-inlining');
  const border = await page
    .getByTestId('css-marker')
    .evaluate((el) => getComputedStyle(el).borderLeftWidth);
  expect(border).toBe('4px');
  expect(cssRequests).toEqual([]);
  evidence(
    `HTML has <style> (${inlined!.length} bytes) with .ft-css-inlining-marker; 0 <link rel=stylesheet>; 0 CSS requests; rule applied (border-left 4px)`,
  );
});

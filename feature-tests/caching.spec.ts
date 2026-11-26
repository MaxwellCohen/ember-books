import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('TTL cache returns the same value until revalidated', async ({ request }) => {
  const first = await request.get('/api/feature-tests/cached-time');
  const a = await first.json();
  const b = await (await request.get('/api/feature-tests/cached-time')).json();
  expect(b).toEqual(a);
  const cc = first.headers()['cache-control'];
  expect(cc).toContain('s-maxage=3600');

  // SSR route reads the same cache (inside the SSR worker): stable across requests.
  const value = (html: string) => html.match(/data-testid="cached-value">(?:<!--[^>]*-->)?([^<]+)/)?.[1];
  const page1 = value(await (await request.get('/feature-tests/caching')).text());
  const page2 = value(await (await request.get('/feature-tests/caching')).text());
  expect(page1).toBeTruthy();
  expect(page2).toBe(page1);

  await request.post('/api/feature-tests/revalidate');
  const c = await (await request.get('/api/feature-tests/cached-time')).json();
  expect(c.value).not.toBe(a.value);
  const d = await (await request.get('/api/feature-tests/cached-time')).json();
  expect(d).toEqual(c);
  evidence(
    `API value ${a.value} identical on 2nd request; SSR page value stable (${page1}); after revalidate new value ${c.value}, then cached again; Cache-Control "${cc}"`,
  );
});

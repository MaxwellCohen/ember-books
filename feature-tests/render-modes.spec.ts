import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

const renderedAt = (html: string) => html.match(/data-testid="rendered-at">(?:<!--[^>]*-->)?([^<]+)/)?.[1];

test('server route renders per request; client route ships the SPA shell', async ({ page, request }) => {
  const a = await (await request.get('/feature-tests/render-modes/server')).text();
  await new Promise((r) => setTimeout(r, 20));
  const b = await (await request.get('/feature-tests/render-modes/server')).text();
  expect(a).toContain('data-mode="server"');
  expect(renderedAt(a)).toBeTruthy();
  expect(renderedAt(b)).not.toBe(renderedAt(a));

  const shell = await (await request.get('/feature-tests/render-modes/client')).text();
  expect(shell).not.toContain('data-testid="render-mode"');
  expect(shell).not.toContain('data-testid="feature-tests"');

  await page.goto('/feature-tests/render-modes/client');
  await expect(page.getByTestId('render-mode')).toHaveAttribute('data-mode', 'client');
  evidence(
    `/render-modes/server SSR timestamps differ per request (${renderedAt(a)} vs ${renderedAt(b)}); /render-modes/client HTML is the empty shell and renders data-mode=client in the browser`,
  );
});

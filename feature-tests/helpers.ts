import { test } from '@playwright/test';

/** Record a one-line observation that run.mjs copies into results.json. */
export function evidence(text: string) {
  test.info().annotations.push({ type: 'evidence', description: text });
}

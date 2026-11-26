import { expect, test } from '@playwright/test';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, statSync } from 'node:fs';
import { evidence } from './helpers';

test('vite-bundle-visualizer writes an HTML treemap and a JSON report', async () => {
  const html = 'feature-tests/.out/stats.html';
  const json = 'feature-tests/.out/stats.json';
  rmSync(html, { force: true });
  rmSync(json, { force: true });
  execSync(`npx vite-bundle-visualizer -o ${html} --open false`, {
    stdio: 'inherit',
  });
  execSync(`npx vite-bundle-visualizer -t raw-data -o ${json}`, {
    stdio: 'inherit',
  });
  expect(existsSync(html)).toBe(true);
  expect(statSync(html).size).toBeGreaterThan(10_000);
  const data = JSON.parse(readFileSync(json, 'utf8'));
  const modules = Object.keys(data.nodeMetas ?? {}).length;
  expect(modules).toBeGreaterThan(50);
  evidence(
    `stats.html ${statSync(html).size} B and stats.json with ${modules} modules generated`,
  );
});

import { expect, test } from '@playwright/test';
import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { evidence } from './helpers';

const run = (cmd: string) => execSync(cmd, { stdio: 'inherit' });

test('builds for Node, Cloudflare Workers and Netlify Functions', async () => {
  // Node (server.js) + Vercel function (api/index.js) both consume this output.
  run('npm run build');
  expect(existsSync('dist/server/app-ssr.js')).toBe(true);
  expect(existsSync('dist/server/template.html')).toBe(true);
  expect(existsSync('dist/client/assets')).toBe(true);

  expect(existsSync('dist/client/_headers')).toBe(true);
  // Static SPA shell used by the Cloudflare + Netlify deploys (same steps as deploy:* scripts).
  copyFileSync('dist/server/template.html', 'dist/client/index.html');

  // Cloudflare Workers: wrangler bundles workers/index.mjs without deploying.
  rmSync('feature-tests/.out/cloudflare', { recursive: true, force: true });
  run(
    'npx --yes wrangler@4.131.2 deploy --dry-run --outdir feature-tests/.out/cloudflare',
  );
  const worker = 'feature-tests/.out/cloudflare/index.js';
  expect(existsSync(worker)).toBe(true);
  expect(readFileSync(worker, 'utf8')).toContain('/api/catalog');

  // Netlify Functions: the bundler Netlify runs on deploy (zip-it-and-ship-it), with netlify.toml's settings.
  rmSync('feature-tests/.out/netlify', { recursive: true, force: true });
  run(
    `npx --yes @netlify/zip-it-and-ship-it@16.6.0 netlify/functions feature-tests/.out/netlify --config '{"*":{"nodeBundler":"esbuild","externalNodeModules":["@netlify/blobs"]}}'`,
  );
  const zip = 'feature-tests/.out/netlify/api.zip';
  expect(existsSync(zip)).toBe(true);
  expect(existsSync('dist/client/index.html')).toBe(true);

  rmSync('dist/client/index.html');
  evidence(
    `node: dist/server/app-ssr.js + template.html; cloudflare: wrangler --dry-run worker ${statSync(worker).size} B; netlify: api.zip ${statSync(zip).size} B + dist/client/index.html shell`,
  );
});

// Builds, serves (PORT 4117) and runs every feature spec, then writes feature-tests/results.json.
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { stripVTControlCharacters } from 'node:util';

const PORT = process.env.FT_PORT || '4117';
const OUT = 'feature-tests/.out';
mkdirSync(OUT, { recursive: true });

const FEATURES = {
  'css-inlining': [
    'manual',
    'scripts/prepare-server-template.mjs swaps the built stylesheet <link> for an inline <style> in the server template',
  ],
  'font-optimization': [
    'third-party',
    '@fontsource-variable/geist (@import in app.css) + build-script <link rel=preload as=font> for the latin subset',
  ],
  'image-pipeline': [
    'third-party',
    '@responsive-image/vite-plugin (?responsive import, AVIF/WebP/JPEG at 640/1080/1920w) + <ResponsiveImage> from @responsive-image/ember',
  ],
  caching: [
    'manual',
    'hand-rolled TTL cache in server/catalog-cache.js (cacheLifeHours + new revalidateCacheKey) behind /api/feature-tests/cached-time and the SSR route model',
  ],
  'route-prefetching': [
    'manual',
    'ember-modifier prefetch-book on <LinkTo> warms loadBook() on pointerenter/focus; book route model takes the cached promise',
  ],
  islands: [
    'manual',
    'server swaps app/entry.js for app/islands.js on /feature-tests/islands; renderComponent (@ember/renderer, RFC 1099) mounts the island',
  ],
  'render-modes': [
    'manual',
    'per-path choice in server.js/handle-request.js: SSR (vite-ember-ssr) per request vs SPA shell for /feature-tests/render-modes/client',
  ],
  reactivity: [
    'first-party',
    '@tracked (@glimmer/tracking) autotracking in a Glimmer component',
  ],
  'bundle-analysis': [
    'third-party',
    'npx vite-bundle-visualizer (community CLI over rollup-plugin-visualizer)',
  ],
  'third-party-scripts': [
    'manual',
    'ember-modifier injects an async <script> after window load + requestIdleCallback',
  ],
  'multi-host-deployment': [
    'manual',
    'hand-written host entries: Node server.js, Cloudflare workers/index.mjs (wrangler --dry-run), Netlify functions (zip-it-and-ship-it)',
  ],
};

function playwright(project) {
  const file = resolve(OUT, `report-${project}.json`);
  try {
    execSync(
      `npx playwright test -c feature-tests/playwright.config.mjs --project ${project} --reporter=json`,
      {
        stdio: ['ignore', 'pipe', 'inherit'],
        env: {
          ...process.env,
          FT_PORT: PORT,
          PLAYWRIGHT_JSON_OUTPUT_NAME: file,
        },
        maxBuffer: 1 << 28,
      },
    );
  } catch {
    // Failures are recorded in the JSON report.
  }
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return { suites: [] };
  }
}

function collect(report, into) {
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) {
      const id = spec.file.replace(/^.*\//, '').replace(/\.spec\.ts$/, '');
      const t = spec.tests[0];
      const r = t?.results?.at(-1);
      const ev = (t?.annotations ?? [])
        .concat(r?.annotations ?? [])
        .filter((a) => a.type === 'evidence')
        .map((a) => a.description);
      const message = stripVTControlCharacters(r?.error?.message ?? '');
      const err =
        message.split('\n').filter(Boolean).slice(0, 2).join(' | ') ||
        undefined;
      into[id] = {
        ok: r?.status === 'passed',
        evidence: ev.at(-1) ?? err ?? r?.status ?? 'no result',
      };
    }
    for (const child of suite.suites ?? []) walk(child);
  };
  for (const s of report.suites ?? []) walk(s);
}

const observed = {};
// 1) Build-time features first: they run their own builds into dist/.
collect(playwright('build'), observed);

// 2) Fresh production build, then serve it.
execSync('npm run build', { stdio: 'inherit' });
const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT },
  stdio: ['ignore', 'ignore', 'inherit'],
});
try {
  const deadline = Date.now() + 60_000;
  for (;;) {
    try {
      if (
        (await fetch(`http://localhost:${PORT}/api/feature-tests/cached-time`))
          .ok
      )
        break;
    } catch {
      // server not up yet; retry until the deadline
    }
    if (Date.now() > deadline) throw new Error('server did not start');
    await new Promise((r) => setTimeout(r, 500));
  }
  collect(playwright('browser'), observed);
} finally {
  server.kill('SIGTERM');
}

const results = {};
for (const [id, [claimedLabel, method]] of Object.entries(FEATURES)) {
  const o = observed[id];
  results[id] = {
    claimedLabel,
    status: o ? (o.ok ? 'pass' : 'fail') : 'blocked',
    method,
    evidence: o?.evidence ?? 'spec did not run',
    test: `feature-tests/${id}.spec.ts`,
  };
}

writeFileSync(
  'feature-tests/results.json',
  JSON.stringify(
    {
      framework: 'ember',
      repo: 'ember-books',
      commit: execSync('git rev-parse HEAD').toString().trim(),
      ranAt: new Date().toISOString(),
      results,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  Object.entries(results)
    .map(([id, r]) => `${r.status.padEnd(7)} ${id}`)
    .join('\n'),
);

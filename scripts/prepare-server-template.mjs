import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const clientDir = resolve(root, 'dist/client');
const clientIndex = resolve(clientDir, 'index.html');
const serverTemplate = resolve(root, 'dist/server/template.html');
const islandsTemplate = resolve(root, 'dist/server/islands-template.html');

let html = await readFile(clientIndex, 'utf8');

// Feature test css-inlining (hand-rolled): swap the built stylesheet <link> for a <style>.
const link = html.match(
  /<link[^>]+rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/,
);
if (link) {
  const css = await readFile(resolve(clientDir, link[1].slice(1)), 'utf8');
  html = html.replace(
    link[0],
    () => `<style data-inlined="${link[1]}">${css}</style>`,
  );
}

// Feature test font-optimization: Fontsource self-hosts the files; preload the latin
// Geist face the first paint needs (Fontsource has no preload helper).
const assets = await readdir(resolve(clientDir, 'assets'));
const latin = assets.find((f) => /^geist-latin-wght-normal-.*\.woff2$/.test(f));
if (latin) {
  html = html.replace(
    '<link rel="icon"',
    `<link rel="preload" href="/assets/${latin}" as="font" type="font/woff2" crossorigin>\n    <link rel="icon"`,
  );
}

await mkdir(resolve(root, 'dist/server'), { recursive: true });
await writeFile(serverTemplate, html);

// Feature test islands (hand-rolled): same template, but boot app/islands.js
// instead of the full app entry.
const manifestPath = resolve(clientDir, '.vite/manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const islands = manifest['app/islands.js'];
const islandsHtml = html.replace(
  /<script type="module" crossorigin src="\/assets\/main-[^"]+\.js"><\/script>/,
  `<script type="module" crossorigin src="/${islands.file}"></script>`,
);
await writeFile(islandsTemplate, islandsHtml);

await rm(resolve(clientDir, '.vite'), { recursive: true, force: true });
await rm(clientIndex);

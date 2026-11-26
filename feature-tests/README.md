# Feature tests

Validates each Framework Compare label for Ember with a real test against a production build.

```sh
npm run test:features   # FT_PORT=4117 by default; CHROME_PATH overrides the system Chrome
```

`feature-tests/run.mjs` runs the build-time specs (Playwright project `build`), then
`npm run build`, starts `node server.js` on the port, runs the browser specs (project
`browser`), stops the server and writes `feature-tests/results.json`. Scratch output goes
to `feature-tests/.out/` (git-ignored). Pages live under `/feature-tests/<featureId>`.

| Spec | Label | What it checks |
| --- | --- | --- |
| css-inlining | Manual | Server HTML has a `<style>` with `.ft-css-inlining-marker` (inlined by `scripts/prepare-server-template.mjs`), no `<link rel=stylesheet>`, no CSS requests, rule applied. |
| font-optimization | Third-party | Fontsource Geist: `<link rel=preload as=font>` to a self-hosted woff2, `@font-face` with `font-display: swap`, all font requests same-origin, no Google Fonts. |
| image-pipeline | Third-party | `@responsive-image/ember` + vite plugin: `<picture>` sources with ≥2 `w` widths (srcset is on `<source>`), `width`/`height`, offscreen `loading=lazy` image not requested until scrolled, srcset URL served as `image/avif`. |
| caching | Manual | `/api/feature-tests/cached-time` (hand-rolled TTL cache in `server/catalog-cache.js`) returns the same value twice, SSR page value stable, new value after `POST /api/feature-tests/revalidate`, `s-maxage` header. |
| route-prefetching | Manual | Hovering a `<LinkTo {{prefetchBook}}>` fires `GET /api/books/:id` before the click; the book route reuses that promise (no second request). |
| islands | Manual | `/feature-tests/islands` is SSR'd with `app/islands.js` instead of the app entry; `renderComponent` mounts the button, which toggles; no loaded JS contains the static component's marker (the main bundle does). |
| render-modes | Manual | `/feature-tests/render-modes/server` SSR timestamp changes per request; `/feature-tests/render-modes/client` HTML is the unrendered shell and renders in the browser. |
| reactivity | 1st-party | `@tracked` count updates the same text node 0→3 while a template-level render counter stays at 1. |
| bundle-analysis | Third-party | `npx vite-bundle-visualizer` writes `stats.html` and a raw-data `stats.json`. |
| third-party-scripts | Manual | Stand-in `/feature-tests/fake-third-party.js` is absent from server HTML, requested after `loadEventEnd` (load + idle injection), and sets its global. |
| multi-host-deployment | Manual | `npm run build` (Node/Vercel output), `wrangler deploy --dry-run` (Cloudflare Worker bundle), `zip-it-and-ship-it` (Netlify function zip) + SPA shell. |

Note: vite-ember-ssr runs modifiers against its server DOM, so client-only modifiers
(the third-party script loader) must check `import.meta.env.SSR`.

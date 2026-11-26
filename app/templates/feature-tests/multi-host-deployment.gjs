<template>
  <h1 class="text-2xl font-semibold">Multi-host deployment (Manual)</h1>
  <p>Hand-written per-host entries: server.js (Node), api/index.js + vercel.json
    (Vercel), workers/index.mjs + wrangler.jsonc (Cloudflare),
    netlify/functions/api.mjs + netlify.toml (Netlify).
    feature-tests/multi-host-deployment.spec.ts builds them.</p>
</template>

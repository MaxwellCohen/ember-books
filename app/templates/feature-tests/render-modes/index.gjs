import { LinkTo } from '@ember/routing';

<template>
  <h1 class="text-2xl font-semibold">Render modes (Manual)</h1>
  <p>server/feature-tests.js picks the mode per path in the request handler.</p>
  <ul class="list-disc pl-6">
    <li><LinkTo @route="feature-tests.render-modes.server">server (SSR per request)</LinkTo></li>
    <li><a href="/feature-tests/render-modes/client">client (SPA shell, rendered in the browser)</a></li>
  </ul>
</template>

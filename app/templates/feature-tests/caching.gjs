<template>
  <h1 class="text-2xl font-semibold">Caching (Manual)</h1>
  <p>
    server/catalog-cache.js (hand-rolled TTL cache, 1h) wraps a loader that returns a
    random value. Revalidate with POST /api/feature-tests/revalidate.
  </p>
  <p>Cached value: <code data-testid="cached-value">{{@model.value}}</code></p>
  <p>Generated at: <code data-testid="cached-at">{{@model.generatedAt}}</code></p>
</template>

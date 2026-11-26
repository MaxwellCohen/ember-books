import { LinkTo } from '@ember/routing';

const FEATURES = [
  'css-inlining',
  'font-optimization',
  'image-pipeline',
  'caching',
  'route-prefetching',
  'render-modes',
  'reactivity',
  'bundle-analysis',
  'third-party-scripts',
  'multi-host-deployment',
].map((id) => ({ id, route: `feature-tests.${id}` }));

<template>
  <h1 class="text-2xl font-semibold">Feature tests</h1>
  <p>One page per performance feature, validated by the specs in
    <code>feature-tests/</code>.</p>
  <ul class="list-disc pl-6">
    {{#each FEATURES as |f|}}
      <li><LinkTo @route={{f.route}}>{{f.id}}</LinkTo></li>
    {{/each}}
    {{! islands is a full page load: the server swaps the app entry for app/islands.js }}
    <li><a href="/feature-tests/islands">islands</a></li>
  </ul>
</template>

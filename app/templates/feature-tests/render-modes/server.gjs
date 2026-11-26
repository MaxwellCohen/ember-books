<template>
  <h1 class="text-2xl font-semibold">Render mode: server</h1>
  <p data-testid="render-mode" data-mode={{@model.mode}}>Rendered on the
    {{@model.mode}}
    at
    <time data-testid="rendered-at">{{@model.renderedAt}}</time></p>
</template>

import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';

<template>
  {{pageTitle "Feature tests"}}
  <div
    class="flex flex-1 flex-col gap-4 px-4 py-5 sm:px-6"
    data-testid="feature-tests"
  >
    <LinkTo @route="feature-tests.index" class="text-sm underline">← Feature
      tests</LinkTo>
    {{outlet}}
  </div>
</template>

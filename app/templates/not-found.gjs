import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
import EmptyState from '../components/ui/empty-state';

<template>
  {{pageTitle "Page not found"}}
  <EmptyState @body="That page isn't in the catalog." @title="Page not found">
    <LinkTo
      @route="index"
      class="mt-1 inline-flex h-9 items-center justify-center rounded-full border border-divider bg-white px-4 text-sm font-semibold text-black transition-colors hover:border-gray/40 hover:bg-card focus-visible:ring-2 focus-visible:ring-action/40 focus-visible:outline-none dark:border-divider-dark dark:bg-transparent dark:text-white dark:hover:border-gray/30 dark:hover:bg-card-dark"
    >
      Back to the shelf
    </LinkTo>
  </EmptyState>
</template>

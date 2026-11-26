import { LinkTo } from '@ember/routing';
import prefetchBook from '../../modifiers/prefetch-book';
import { SAMPLE_BOOKS } from '../../lib/book/data/sample-books';

const BOOKS = SAMPLE_BOOKS.slice(0, 3).map((b) => ({
  id: String(b.id),
  title: b.title,
}));

<template>
  <h1 class="text-2xl font-semibold">Route prefetching (Manual)</h1>
  <p>Hovering or focusing a link starts the book request; the route's model hook
    reuses it.</p>
  <ul class="list-disc pl-6">
    {{#each BOOKS as |book|}}
      <li>
        <LinkTo
          @route="book"
          @model={{book.id}}
          data-book-id={{book.id}}
          {{prefetchBook book.id}}
        >{{book.title}}</LinkTo>
      </li>
    {{/each}}
  </ul>
</template>

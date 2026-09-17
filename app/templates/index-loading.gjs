import { BookGridSkeleton } from '../components/book/book-grid';
import { BookPaginationSkeleton } from '../components/book/book-pagination';

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex-1 px-4 py-5 sm:px-6">
      <BookGridSkeleton />
    </div>
    <footer
      class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6"
    >
      <BookPaginationSkeleton />
    </footer>
  </div>
</template>

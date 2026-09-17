import BackToBooksLink from '../components/book/back-to-books-link';
import { BookDetailSkeleton } from '../components/book/book-detail';

<template>
  <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
    <BackToBooksLink @class="mb-6" />
    <BookDetailSkeleton />
  </div>
</template>

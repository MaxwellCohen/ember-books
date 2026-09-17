import BookGrid from '../components/book/book-grid';
import BookPagination from '../components/book/book-pagination';

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6"
      data-filtering={{if @controller.pending.isPending ""}}
    >
      <BookGrid @books={{@model.books}} @searchParams={{@model.searchParams}} />
    </div>
    <footer
      class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6"
    >
      <BookPagination
        @searchParams={{@model.searchParams}}
        @total={{@model.total}}
      />
    </footer>
  </div>
</template>

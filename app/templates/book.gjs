import { pageTitle } from 'ember-page-title';
import BackToBooksLink from '../components/book/back-to-books-link';
import BookDetail from '../components/book/book-detail';
import BookNotFound from '../components/book/book-not-found';

<template>
  {{#if @model.book}}
    {{pageTitle @model.book.title}}
    <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink @class="mb-6" />
      <BookDetail @book={{@model.book}} />
    </div>
  {{else}}
    {{pageTitle "Book not found"}}
    <BookNotFound />
  {{/if}}
</template>

import { pageTitle } from 'ember-page-title';
import BookSearch from '../components/book/book-search';
import BookSidebar from '../components/book/book-sidebar';
import MobileBookSidebar from '../components/book/mobile-book-sidebar';
import MobileBookSidebarTrigger from '../components/book/mobile-book-sidebar-trigger';

<template>
  {{pageTitle "Ember Books"}}

  <MobileBookSidebar>
    <div class="group flex min-h-dvh">
      <aside
        class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r px-5 py-5 md:flex"
      >
        <BookSidebar @idPrefix="desktop" />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="border-divider bg-surface/80 dark:border-divider-dark dark:bg-surface-dark/80 sticky top-0 z-20 flex items-center gap-2 border-b px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6"
        >
          <MobileBookSidebarTrigger />
          <BookSearch />
        </header>

        <main class="flex min-w-0 flex-1 flex-col">
          {{outlet}}
        </main>
      </div>
    </div>
  </MobileBookSidebar>
</template>

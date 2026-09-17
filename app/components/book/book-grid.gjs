import Component from '@glimmer/component';
import {
  ITEMS_PER_PAGE,
  PRIORITY_COVER_COUNT,
} from '../../lib/book/book-constants';
import EmptyState from '../ui/empty-state';
import BookCard, { BookCardSkeleton } from './book-card';

const gridClass =
  'grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7';

export default class BookGrid extends Component {
  get books() {
    return this.args.books ?? [];
  }

  get numberedBooks() {
    return this.books.map((book, index) => ({
      book,
      id: book.id,
      priority: index < PRIORITY_COVER_COUNT,
    }));
  }

  <template>
    {{#if this.books.length}}
      <div class={{gridClass}}>
        {{#each this.numberedBooks key="id" as |item|}}
          <BookCard
            @book={{item.book}}
            @priority={{item.priority}}
            @searchParams={{@searchParams}}
          />
        {{/each}}
      </div>
    {{else}}
      <EmptyState
        @body="Nothing matched these filters. Try widening the year range or clearing the search."
        @title="No books found"
      />
    {{/if}}
  </template>
}

export class BookGridSkeleton extends Component {
  get placeholders() {
    return Array.from(
      { length: this.args.count ?? ITEMS_PER_PAGE },
      (_, index) => index,
    );
  }

  <template>
    <div aria-hidden="true" class={{gridClass}}>
      {{#each this.placeholders}}
        <BookCardSkeleton />
      {{/each}}
    </div>
  </template>
}

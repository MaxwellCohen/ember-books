import Component from '@glimmer/component';
import { LinkTo } from '@ember/routing';
import { toEmberQueryParams } from '../../lib/url-state';
import BookCover, { BookCoverSkeleton } from './book-cover';

export default class BookCard extends Component {
  get query() {
    return toEmberQueryParams(this.args.searchParams ?? {});
  }

  get bookId() {
    return String(this.args.book.id);
  }

  <template>
    <LinkTo
      @model={{this.bookId}}
      @query={{this.query}}
      @route="book"
      class="focus-visible:ring-action focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <BookCover
        @class="group-hover:shadow-soft transition-shadow"
        @priority={{@priority}}
        @src={{@book.image_url}}
        @title={{@book.title}}
      />
      <span class="sr-only">{{@book.title}}</span>
    </LinkTo>
  </template>
}

const BookCardSkeleton = <template><BookCoverSkeleton /></template>;

export { BookCardSkeleton };

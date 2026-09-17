import Component from '@glimmer/component';
import { formatCount, getLanguageLabel } from '../../lib/book/book-utils';
import BookCover, { BookCoverSkeleton } from './book-cover';
import Skeleton from '../ui/skeleton';
import StarRating from '../ui/star-rating';
import {
  BookOpenIcon,
  Building2Icon,
  CalendarDaysIcon,
  GlobeIcon,
  HashIcon,
} from '../ui/icons';

export default class BookDetail extends Component {
  get book() {
    return this.args.book;
  }

  get rating() {
    return Number(this.book.average_rating);
  }

  get hasRating() {
    return this.book.average_rating !== null && !Number.isNaN(this.rating);
  }

  get ratingLabel() {
    return this.rating.toFixed(1);
  }

  get ratingsCount() {
    return this.book.ratings_count
      ? formatCount(this.book.ratings_count)
      : null;
  }

  get authors() {
    return this.book.authors?.length ? this.book.authors.join(', ') : null;
  }

  get pages() {
    return this.book.num_pages
      ? this.book.num_pages.toLocaleString()
      : 'Unknown';
  }

  get language() {
    return getLanguageLabel(this.book.language_code);
  }

  get published() {
    return this.book.publication_year ?? 'Unknown';
  }

  get publisher() {
    return this.book.publisher ?? 'Unknown';
  }

  get isbn() {
    return this.book.isbn ?? 'None';
  }

  <template>
    <article class="flex flex-col gap-8 md:flex-row md:gap-10">
      <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
        <BookCover
          @class="shadow-soft ring-divider/70 dark:ring-divider-dark/70 ring-1"
          @priority={{true}}
          @src={{this.book.image_url}}
          @title={{this.book.title}}
        />
      </div>

      <div class="min-w-0 flex-1">
        <h1>{{this.book.title}}</h1>
        {{#if this.authors}}
          <p class="text-muted mt-2 text-base sm:text-lg">{{this.authors}}</p>
        {{/if}}

        {{#if this.hasRating}}
          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating @rating={{this.rating}} />
            <span
              class="text-sm font-semibold tabular-nums"
            >{{this.ratingLabel}}</span>
            {{#if this.ratingsCount}}
              <span
                class="text-muted text-sm tabular-nums"
              >{{this.ratingsCount}} ratings</span>
            {{/if}}
          </div>
        {{/if}}

        {{#if this.book.description}}
          <p
            class="text-muted mt-6 max-w-prose text-sm leading-7"
          >{{this.book.description}}</p>
        {{/if}}

        <dl
          class="border-divider dark:border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2"
        >
          <Fact @label="Pages">
            <:icon><BookOpenIcon /></:icon>
            <:default>{{this.pages}}</:default>
          </Fact>
          <Fact @label="Language">
            <:icon><GlobeIcon /></:icon>
            <:default>{{this.language}}</:default>
          </Fact>
          <Fact @label="Published">
            <:icon><CalendarDaysIcon /></:icon>
            <:default>{{this.published}}</:default>
          </Fact>
          <Fact @label="Publisher">
            <:icon><Building2Icon /></:icon>
            <:default>{{this.publisher}}</:default>
          </Fact>
          <Fact @label="ISBN">
            <:icon><HashIcon /></:icon>
            <:default>
              <span class="font-mono text-xs">{{this.isbn}}</span>
            </:default>
          </Fact>
        </dl>
      </div>
    </article>
  </template>
}

const Fact = <template>
  <div class="flex items-start gap-3">
    <span class="text-muted mt-0.5 shrink-0">{{yield to="icon"}}</span>
    <div class="min-w-0">
      <dt
        class="text-muted text-xs font-semibold tracking-wide uppercase"
      >{{@label}}</dt>
      <dd class="mt-0.5 truncate text-sm">{{yield}}</dd>
    </div>
  </div>
</template>;

const placeholders = [0, 1, 2, 3, 4];

const BookDetailSkeleton = <template>
  <div aria-hidden="true" class="flex flex-col gap-8 md:flex-row md:gap-10">
    <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
      <BookCoverSkeleton />
    </div>
    <div class="min-w-0 flex-1">
      <Skeleton @class="skeleton-subtle h-8 w-3/4 max-w-md" />
      <Skeleton @class="skeleton-subtle mt-3 h-5 w-40" />
      <Skeleton @class="skeleton-subtle mt-5 h-4 w-56" />
      <div class="mt-6 flex flex-col gap-2.5">
        <Skeleton @class="skeleton-subtle h-3.5 w-full max-w-prose" />
        <Skeleton @class="skeleton-subtle h-3.5 w-full max-w-prose" />
        <Skeleton @class="skeleton-subtle h-3.5 w-4/5 max-w-prose" />
      </div>
      <div
        class="border-divider dark:border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2"
      >
        {{#each placeholders}}
          <div class="flex items-start gap-3">
            <Skeleton @class="skeleton-subtle mt-0.5 size-4 rounded" />
            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton @class="skeleton-subtle h-3 w-16" />
              <Skeleton @class="skeleton-subtle h-4 w-24" />
            </div>
          </div>
        {{/each}}
      </div>
    </div>
  </div>
</template>;

export { BookDetailSkeleton };

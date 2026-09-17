import Component from '@glimmer/component';
import { LinkTo } from '@ember/routing';
import { cn } from '../../lib/utils';
import {
  getCurrentPage,
  getTotalPages,
  toEmberQueryParams,
  withPage,
} from '../../lib/url-state';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons';
import Skeleton from '../ui/skeleton';

const stepClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white';

export default class BookPagination extends Component {
  get totalPages() {
    return getTotalPages(this.args.total ?? 0);
  }

  get currentPage() {
    return getCurrentPage(this.args.searchParams ?? {}, this.totalPages);
  }

  get hasPrevious() {
    return this.currentPage > 1;
  }

  get hasNext() {
    return this.currentPage < this.totalPages;
  }

  get previousQuery() {
    return toEmberQueryParams(
      withPage(this.args.searchParams ?? {}, this.currentPage - 1),
    );
  }

  get nextQuery() {
    return toEmberQueryParams(
      withPage(this.args.searchParams ?? {}, this.currentPage + 1),
    );
  }

  get totalLabel() {
    return (this.args.total ?? 0).toLocaleString();
  }

  get pageLabel() {
    return `Page ${this.currentPage.toLocaleString()} of ${this.totalPages.toLocaleString()}`;
  }

  <template>
    <nav
      aria-label="Pagination"
      class="flex items-center justify-between gap-4"
    >
      {{#if this.hasPrevious}}
        <LinkTo
          @query={{this.previousQuery}}
          @route="index"
          aria-label="Previous page"
          class={{stepClass}}
        >
          <ChevronLeftIcon />
          Previous
        </LinkTo>
      {{else}}
        <span class={{cn stepClass "pointer-events-none opacity-40"}}>
          <ChevronLeftIcon />
          Previous
        </span>
      {{/if}}

      <p
        class="text-muted flex items-center gap-2 text-xs tabular-nums sm:text-sm"
      >
        <span class="hidden sm:inline">
          <span
            class="font-medium text-black dark:text-white"
          >{{this.totalLabel}}</span>
          books
        </span>
        <span
          aria-hidden="true"
          class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block"
        ></span>
        <span>{{this.pageLabel}}</span>
      </p>

      {{#if this.hasNext}}
        <LinkTo
          @query={{this.nextQuery}}
          @route="index"
          aria-label="Next page"
          class={{stepClass}}
        >
          Next
          <ChevronRightIcon />
        </LinkTo>
      {{else}}
        <span class={{cn stepClass "pointer-events-none opacity-40"}}>
          Next
          <ChevronRightIcon />
        </span>
      {{/if}}
    </nav>
  </template>
}

const BookPaginationSkeleton = <template>
  <div aria-hidden="true" class="flex items-center justify-between gap-4">
    <span class={{cn stepClass "pointer-events-none opacity-40"}}>
      <ChevronLeftIcon />
      Previous
    </span>
    <div class="flex items-center gap-2">
      <Skeleton @class="skeleton-subtle hidden h-4 w-20 sm:block" />
      <span
        class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block"
      ></span>
      <Skeleton @class="skeleton-subtle h-4 w-20" />
    </div>
    <span class={{cn stepClass "pointer-events-none opacity-40"}}>
      Next
      <ChevronRightIcon />
    </span>
  </div>
</template>;

export { BookPaginationSkeleton };

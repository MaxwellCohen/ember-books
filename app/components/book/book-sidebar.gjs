import ApiDelay from './api-delay';
import BookFilters from './book-filters';
import CatalogSize from './catalog-size';
import HomeLink from './home-link';
import ThemeToggle from '../theme/theme-toggle';
import GitHubIcon from '../ui/github-icon';

const BookSidebar = <template>
  <div class="flex items-center justify-between gap-2">
    <HomeLink />
  </div>
  <div class="border-divider dark:border-divider-dark mt-6 border-b pb-5">
    <CatalogSize />
  </div>
  <div class="mt-5 mb-4">
    <ApiDelay @idPrefix={{@idPrefix}} />
  </div>
  <p
    class="text-muted mb-4 text-xs font-semibold tracking-wide uppercase"
  >Filters</p>
  <BookFilters @idPrefix={{@idPrefix}} />
  {{#unless @mobile}}
    <div
      class="border-divider dark:border-divider-dark mt-4 flex items-center justify-between gap-2 border-t pt-4"
    >
      <ThemeToggle @variant="inline" />
      <a
        aria-label="View source on GitHub"
        class="text-muted rounded-full p-1.5 transition-colors hover:text-black dark:hover:text-white"
        href="https://github.com/emberjs/ember.js"
        rel="noopener noreferrer"
        target="_blank"
      >
        <GitHubIcon @class="size-4" />
      </a>
    </div>
  {{/unless}}
</template>;

export default BookSidebar;

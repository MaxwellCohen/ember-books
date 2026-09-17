import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';
import { buildWaiter } from '@ember/test-waiters';
import { withFilters } from '../../lib/url-state';
import IconButton from '../ui/icon-button';
import Input from '../ui/input';
import Spinner from '../ui/spinner';
import { SearchIcon, XIcon } from '../ui/icons';

const DEBOUNCE_MS = 220;
const searchWaiter = buildWaiter('book-search-debounce');

const syncSearchValue = modifier((element, [value]) => {
  if (document.activeElement !== element) {
    element.value = value ?? '';
  }
});

export default class BookSearch extends Component {
  @service pending;
  @service urlState;

  timer = null;

  get committed() {
    return this.urlState.params.search ?? '';
  }

  get isFiltering() {
    return this.pending.isPending;
  }

  willDestroy() {
    super.willDestroy();
    if (this.timer) {
      clearTimeout(this.timer.timeout);
      searchWaiter.endAsync(this.timer.token);
    }
  }

  navigate = (value) => {
    const query = value.trim();
    this.urlState.replaceIndex(
      withFilters(this.urlState.params, { search: query || undefined }),
    );
  };

  onInput = (event) => {
    const { value } = event.target;
    if (this.timer) {
      clearTimeout(this.timer.timeout);
      searchWaiter.endAsync(this.timer.token);
    }
    const token = searchWaiter.beginAsync();
    this.timer = {
      token,
      timeout: setTimeout(() => {
        this.navigate(value);
        searchWaiter.endAsync(token);
        this.timer = null;
      }, DEBOUNCE_MS),
    };
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.timer) {
      clearTimeout(this.timer.timeout);
      searchWaiter.endAsync(this.timer.token);
      this.timer = null;
    }
    const input = event.currentTarget.elements.namedItem('search');
    this.navigate(input?.value ?? '');
  };

  clear = (event) => {
    if (this.timer) {
      clearTimeout(this.timer.timeout);
      searchWaiter.endAsync(this.timer.token);
      this.timer = null;
    }
    const form = event.currentTarget.closest('form');
    const input = form?.elements.namedItem('search');
    if (input) input.value = '';
    this.navigate('');
    input?.focus();
  };

  <template>
    <form
      aria-busy={{if this.isFiltering "true"}}
      class="relative flex-1"
      data-filtering={{if this.isFiltering ""}}
      role="search"
      {{on "submit" this.onSubmit}}
    >
      <label class="sr-only" for="book-search">Search books</label>
      <span
        aria-hidden="true"
        class="text-muted pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center"
      >
        {{#if this.isFiltering}}
          <Spinner />
        {{else}}
          <SearchIcon />
        {{/if}}
      </span>
      <Input
        @class="peer"
        @type="search"
        @variant="search"
        id="book-search"
        name="search"
        placeholder="Search books…"
        {{on "input" this.onInput}}
        {{syncSearchValue this.committed}}
      />
      <IconButton
        @class="absolute top-1/2 right-1.5 -translate-y-1/2 peer-placeholder-shown:hidden"
        @label="Clear search"
        {{on "click" this.clear}}
      >
        <XIcon />
      </IconButton>
    </form>
  </template>
}

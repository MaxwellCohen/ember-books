import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
  PAGE_FILTER_VALUES,
  RATING_FILTER_VALUES,
  YEAR_FILTER_VALUES,
} from '../../lib/book/book-constants';
import { withFilters } from '../../lib/url-state';
import Button from '../ui/button';
import Input from '../ui/input';
import Range from '../ui/range';
import Select from '../ui/select';

export default class BookFilters extends Component {
  @service router;
  @service urlState;

  @tracked filters = null;

  constructor() {
    super(...arguments);
    this.router.on('routeDidChange', this.syncFromUrl);
  }

  willDestroy() {
    super.willDestroy();
    this.router.off('routeDidChange', this.syncFromUrl);
  }

  get current() {
    return this.filters ?? this.urlState.params;
  }

  get activeCount() {
    return Object.entries(this.current).filter(
      ([key, value]) => key !== 'page' && key !== 'delay' && Boolean(value),
    ).length;
  }

  get yearValue() {
    return Number(this.current.year ?? MAX_YEAR);
  }

  get yearReadout() {
    return this.current.year ? this.current.year : 'Any year';
  }

  get ratingValue() {
    return Number(this.current.rating ?? MIN_RATING);
  }

  get ratingReadout() {
    return Number(this.current.rating) > 0
      ? `${this.current.rating}+ stars`
      : 'Any rating';
  }

  get pagesValue() {
    return Number(this.current.pages ?? MAX_PAGES);
  }

  get pagesReadout() {
    return this.current.pages
      ? `${Number(this.current.pages).toLocaleString()} pages`
      : 'Any length';
  }

  get languages() {
    const selected = this.current.language ?? 'en';
    return LANGUAGES.map((language) => ({
      ...language,
      selected: language.value === selected,
    }));
  }

  get lists() {
    return LISTS.map((list) => ({
      ...list,
      selected: this.current.list === list.slug,
    }));
  }

  get yearValues() {
    return YEAR_FILTER_VALUES;
  }

  get ratingValues() {
    return RATING_FILTER_VALUES;
  }

  get pageValues() {
    return PAGE_FILTER_VALUES;
  }

  get minYear() {
    return MIN_YEAR;
  }

  get maxYear() {
    return MAX_YEAR;
  }

  get minPages() {
    return MIN_PAGES;
  }

  get maxPagesLabel() {
    return MAX_PAGES.toLocaleString();
  }

  get maxRating() {
    return MAX_RATING;
  }

  syncFromUrl = () => {
    this.filters = null;
  };

  commit(patch) {
    const next = withFilters(this.current, patch);
    this.filters = next;
    this.urlState.replaceIndex(next);
  }

  onYear = (value) => {
    this.commit({ year: value === MAX_YEAR ? undefined : String(value) });
  };

  onRating = (value) => {
    this.commit({ rating: value === MIN_RATING ? undefined : String(value) });
  };

  onPages = (value) => {
    this.commit({ pages: value === MAX_PAGES ? undefined : String(value) });
  };

  onLanguage = (event) => {
    this.commit({ language: event.target.value || undefined });
  };

  toggleList = (event) => {
    const slug = event.target.value;
    this.commit({ list: this.current.list === slug ? undefined : slug });
  };

  reset = () => {
    const delay = this.current.delay;
    const next = delay ? { delay } : {};
    this.filters = next;
    this.urlState.replaceIndex(next);
  };

  <template>
    <div class="flex min-h-0 flex-1 flex-col">
      <div
        class="min-h-0 flex-1 touch-pan-y [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain px-1 pb-6"
      >
        <div class="flex flex-col gap-6">
          <Range
            @id="{{@idPrefix}}-filter-year"
            @label="Published before"
            @value={{this.yearValue}}
            @valueChange={{this.onYear}}
            @values={{this.yearValues}}
          >
            <:readout>{{this.yearReadout}}</:readout>
            <:hint>
              <span>{{this.minYear}}</span>
              <span>{{this.maxYear}}</span>
            </:hint>
          </Range>

          <Range
            @id="{{@idPrefix}}-filter-rating"
            @label="Minimum rating"
            @value={{this.ratingValue}}
            @valueChange={{this.onRating}}
            @values={{this.ratingValues}}
          >
            <:readout>{{this.ratingReadout}}</:readout>
            <:hint>
              <span>Any</span>
              <span>{{this.maxRating}} stars</span>
            </:hint>
          </Range>

          <Range
            @id="{{@idPrefix}}-filter-pages"
            @label="Max pages"
            @value={{this.pagesValue}}
            @valueChange={{this.onPages}}
            @values={{this.pageValues}}
          >
            <:readout>{{this.pagesReadout}}</:readout>
            <:hint>
              <span>{{this.minPages}}</span>
              <span>{{this.maxPagesLabel}}</span>
            </:hint>
          </Range>

          <div class="flex flex-col gap-2">
            <label
              class="text-muted text-xs font-semibold tracking-wide uppercase"
              for="{{@idPrefix}}-filter-language"
            >
              Language
            </label>
            <Select
              id="{{@idPrefix}}-filter-language"
              {{on "change" this.onLanguage}}
            >
              {{#each this.languages as |language|}}
                <option
                  selected={{language.selected}}
                  value={{language.value}}
                >{{language.label}}</option>
              {{/each}}
            </Select>
          </div>

          <fieldset class="flex flex-col gap-2">
            <legend
              class="text-muted mb-2 text-xs font-semibold tracking-wide uppercase"
            >Book lists</legend>
            {{#each this.lists as |list|}}
              <label
                class="hover:bg-card dark:hover:bg-card-dark -mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
              >
                <Input
                  @type="checkbox"
                  @variant="checkbox"
                  checked={{list.selected}}
                  value={{list.slug}}
                  {{on "change" this.toggleList}}
                />
                {{list.name}}
              </label>
            {{/each}}
          </fieldset>
        </div>
      </div>

      {{#if this.activeCount}}
        <div class="border-divider dark:border-divider-dark border-t pt-3">
          <Button
            @class="w-full"
            @variant="secondary"
            {{on "click" this.reset}}
          >
            Clear all filters
          </Button>
        </div>
      {{/if}}
    </div>
  </template>
}

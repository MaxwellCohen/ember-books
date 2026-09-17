import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
} from './book-constants.js';

export function getLanguageLabel(code) {
  if (!code) return 'Unknown';
  const normalized = code.toLowerCase();
  const language = LANGUAGES.find(
    (lang) =>
      lang.value === normalized ||
      (lang.value === 'en' && ['en-gb', 'en-us', 'eng'].includes(normalized)),
  );
  return language ? language.label : 'Unknown';
}

export function formatCount(n) {
  if (n < 1000) return `${n}`;
  if (n < 10_000) return `${(n / 1000).toFixed(1)}K`;
  if (n < 1_000_000) return `${Math.floor(n / 1000)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function toBookFilters({
  isbns,
  language,
  maxPages,
  rating,
  search,
  year,
}) {
  return { isbns, language, maxPages, rating, search, year };
}

export function toBookQuery(params) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const num = (raw, fallback) => {
    const parsed = Number(raw);
    return raw !== undefined && raw !== '' && !Number.isNaN(parsed)
      ? parsed
      : fallback;
  };

  return {
    isbns: LISTS.find((list) => list.slug === params.list)?.isbns ?? '',
    language: params.language ?? '',
    maxPages: clamp(num(params.pages, MAX_PAGES), MIN_PAGES, MAX_PAGES),
    page: Math.max(1, Math.trunc(num(params.page, 1))),
    rating: clamp(num(params.rating, MIN_RATING), MIN_RATING, MAX_RATING),
    search: params.search?.trim() ?? '',
    year: clamp(num(params.year, MAX_YEAR), MIN_YEAR, MAX_YEAR),
  };
}

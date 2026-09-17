import { ITEMS_PER_PAGE } from './book/book-constants.js';

export const API_DELAY_VALUES = [0, 250, 500, 1000, 1500, 2000, 3000];
export const MAX_API_DELAY_MS = 3000;

export const QUERY_PARAM_KEYS = [
  'search',
  'year',
  'rating',
  'pages',
  'language',
  'list',
  'page',
  'delay',
];

const FILTER_KEYS = ['search', 'year', 'rating', 'pages', 'language', 'list'];

export function getApiDelayMs(params) {
  const ms = Number(params.delay);
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.min(MAX_API_DELAY_MS, Math.round(ms));
}

export function formatApiDelay(ms) {
  if (ms <= 0) return 'Off';
  return ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`;
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSearchParams(params) {
  return {
    delay: first(params.delay) || undefined,
    language: first(params.language) || undefined,
    list: first(params.list) || undefined,
    page: first(params.page) || undefined,
    pages: first(params.pages) || undefined,
    rating: first(params.rating) || undefined,
    search: first(params.search) || undefined,
    year: first(params.year) || undefined,
  };
}

export function stringifySearchParams(params) {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') urlParams.append(key, value);
  }
  return urlParams.toString();
}

export function buildHref(params) {
  const query = stringifySearchParams(params);
  return query ? `/?${query}` : '/';
}

export function getTotalPages(total) {
  return Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
}

export function getCurrentPage(params, totalPages) {
  const raw = Number(params.page);
  const page = Number.isInteger(raw) && raw > 0 ? raw : 1;
  return totalPages ? Math.min(page, totalPages) : page;
}

export function withFilters(current, patch) {
  const next = { ...current, ...patch };
  delete next.page;
  for (const key of FILTER_KEYS) {
    if (next[key] === undefined || next[key] === '') delete next[key];
  }
  return next;
}

export function withPage(current, page) {
  const next = { ...current };
  if (page <= 1) delete next.page;
  else next.page = String(page);
  return next;
}

export function toEmberQueryParams(params) {
  const query = {};
  for (const key of QUERY_PARAM_KEYS) {
    query[key] = params[key] ?? '';
  }
  return query;
}

export const catalogControllerQueryParams = [
  { delay: { type: 'string', replace: true } },
  { language: { type: 'string', replace: true } },
  { list: { type: 'string', replace: true } },
  { page: { type: 'string' } },
  { pages: { type: 'string', replace: true } },
  { rating: { type: 'string', replace: true } },
  { search: { type: 'string', replace: true } },
  { year: { type: 'string', replace: true } },
];

export const catalogRouteQueryParams = {
  delay: { refreshModel: true },
  language: { refreshModel: true },
  list: { refreshModel: true },
  page: { refreshModel: true },
  pages: { refreshModel: true },
  rating: { refreshModel: true },
  search: { refreshModel: true },
  year: { refreshModel: true },
};

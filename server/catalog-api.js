import { waitForApiDelay } from '../app/lib/api-delay.js';
import { toBookFilters, toBookQuery } from '../app/lib/book/book-utils.js';
import {
  getApiDelayMs,
  MAX_API_DELAY_MS,
  parseSearchParams,
} from '../app/lib/url-state.js';
import { getBookById, getBooksCount, getBooksPage } from './book-queries.js';
import { hostDocumentCacheControl } from './catalog-cache.js';

export function searchParamsFromUrl(url) {
  const { searchParams } = new URL(url, 'http://ember-books.local');
  return parseSearchParams(Object.fromEntries(searchParams.entries()));
}

export function effectiveApiDelayMs(searchParams) {
  const uiMs = getApiDelayMs(searchParams);
  const envMs = Number(process.env.API_DELAY_MS || 0);
  if (uiMs > 0) return uiMs;
  if (!Number.isFinite(envMs)) return 0;
  return Math.min(MAX_API_DELAY_MS, Math.max(0, envMs));
}

/** Match next-books document Cache-Control (delay does not change headers). */
export function cacheControlFor(_searchParams) {
  return hostDocumentCacheControl();
}

export function cacheHeadersFor(searchParams) {
  return {
    'cache-control': cacheControlFor(searchParams),
  };
}

async function applyApiDelay(searchParams) {
  await waitForApiDelay(effectiveApiDelayMs(searchParams));
}

export async function catalogPayload(searchParams) {
  await applyApiDelay(searchParams);
  const query = toBookQuery(searchParams);
  const [books, total] = await Promise.all([
    getBooksPage(query),
    getBooksCount(toBookFilters(query)),
  ]);
  return { books, total };
}

export async function bookPayload(id, searchParams = {}) {
  await applyApiDelay(searchParams);
  return getBookById(id);
}

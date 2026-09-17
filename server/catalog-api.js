import { waitForApiDelay } from '../app/lib/api-delay.js';
import { toBookFilters, toBookQuery } from '../app/lib/book/book-utils.js';
import {
  getApiDelayMs,
  MAX_API_DELAY_MS,
  parseSearchParams,
} from '../app/lib/url-state.js';
import { getBookById, getBooksCount, getBooksPage } from './book-queries.js';

export function searchParamsFromUrl(url) {
  const { searchParams } = new URL(url, 'http://ember-books.local');
  return parseSearchParams(Object.fromEntries(searchParams.entries()));
}

async function applyApiDelay(searchParams) {
  const uiMs = getApiDelayMs(searchParams);
  const envMs = Number(process.env.API_DELAY_MS || 0);
  const ms =
    uiMs > 0
      ? uiMs
      : Number.isFinite(envMs)
        ? Math.min(MAX_API_DELAY_MS, Math.max(0, envMs))
        : 0;
  await waitForApiDelay(ms);
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

import { toBookFilters, toBookQuery } from './book-utils.js';
import { getBookById, getBooksCount, getBooksPage } from './book-queries.js';
import { stringifySearchParams } from '../url-state.js';

async function loadServerCatalog() {
  return import('../../../server/catalog-api.js');
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) return null;
  return response.json();
}

export async function loadCatalog(searchParams) {
  const query = toBookQuery(searchParams);

  if (import.meta.env.SSR) {
    const { catalogPayload } = await loadServerCatalog();
    const payload = await catalogPayload(searchParams);
    return { books: payload.books, searchParams, total: payload.total };
  }

  try {
    const payload = await fetchJson(
      `/api/catalog?${stringifySearchParams(searchParams)}`,
    );
    if (payload) {
      return { books: payload.books, searchParams, total: payload.total };
    }
  } catch {
    // Tests and static hosts fall back to the in-memory preview catalog.
  }

  return {
    books: getBooksPage(query),
    searchParams,
    total: getBooksCount(toBookFilters(query)),
  };
}

export async function loadBook(id, searchParams) {
  if (import.meta.env.SSR) {
    const { bookPayload } = await loadServerCatalog();
    return {
      book: await bookPayload(id, searchParams),
      searchParams,
    };
  }

  try {
    const book = await fetchJson(
      `/api/books/${encodeURIComponent(id)}?${stringifySearchParams(searchParams)}`,
    );
    if (book) return { book, searchParams };
  } catch {
    // Tests and static hosts fall back to the in-memory preview catalog.
  }

  return {
    book: getBookById(id),
    searchParams,
  };
}

// Feature test route-prefetching (hand-rolled): warm the book request on
// hover/focus and hand the same promise to the route's model hook.
const bookCache = new Map();

function bookKey(id, searchParams) {
  return `${id}?${stringifySearchParams(searchParams ?? {})}`;
}

export function prefetchBook(id, searchParams = {}) {
  const key = bookKey(id, searchParams);
  if (!bookCache.has(key)) bookCache.set(key, loadBook(String(id), searchParams));
  return bookCache.get(key);
}

/** Returns (and forgets) a prefetched book promise so later visits stay fresh. */
export function takePrefetchedBook(id, searchParams = {}) {
  const key = bookKey(id, searchParams);
  const pending = bookCache.get(key);
  bookCache.delete(key);
  return pending;
}

// Server-side helpers for the /feature-tests pages (hand-rolled features).
import { cacheLifeHours, revalidateCacheKey } from './catalog-cache.js';

const TIMESTAMP_KEY = 'feature-tests:timestamp';

/** Caching: a value produced once and served from the TTL cache until revalidated. */
export function cachedTimestamp() {
  return cacheLifeHours(TIMESTAMP_KEY, async () => ({
    generatedAt: new Date().toISOString(),
    value: Math.random().toString(36).slice(2),
  }));
}

export function revalidateTimestamp() {
  revalidateCacheKey(TIMESTAMP_KEY);
}

export const CACHED_TIME_HEADERS = {
  'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};

/** Render modes: paths served as the unrendered SPA shell (client-only). */
const CLIENT_ONLY = [/^\/feature-tests\/render-modes\/client\/?$/];
/** Islands: paths served with app/islands.js instead of app/entry.js. */
const ISLANDS = [/^\/feature-tests\/islands\/?$/];

export function isClientOnly(pathname) {
  return CLIENT_ONLY.some((re) => re.test(pathname));
}

export function isIslandsPage(pathname) {
  return ISLANDS.some((re) => re.test(pathname));
}

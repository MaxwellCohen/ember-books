/** Matches Next cacheLife('hours'): revalidate 1h, expire 24h. */
export const CATALOG_CACHE_REVALIDATE_SECONDS = 3600;
export const CATALOG_CACHE_EXPIRE_SECONDS = 86400;

export const HTML_CACHE_CONTROL = `public, s-maxage=${CATALOG_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${CATALOG_CACHE_EXPIRE_SECONDS}`;

const TTL_MS = CATALOG_CACHE_REVALIDATE_SECONDS * 1000;

const memory = new Map();
const inflight = new Map();

function isVercel() {
  return typeof process !== 'undefined' && Boolean(process.env.VERCEL) && !process.env.CLOUDFLARE;
}

function isNetlify() {
  return typeof process !== 'undefined' && Boolean(process.env.NETLIFY) && !process.env.CLOUDFLARE;
}

function memoryGet(key) {
  const hit = memory.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
}

function memorySet(key, value) {
  memory.set(key, { expiresAt: Date.now() + TTL_MS, value });
}

function edgeRequest(key) {
  return new Request(`https://books-catalog-cache.local/v1/${encodeURIComponent(key)}`);
}

function edgeCache() {
  return globalThis.caches?.default;
}

function delayFromRequest(request) {
  try {
    const delay = Number(new URL(request.url).searchParams.get('delay') ?? 0);
    return Number.isFinite(delay) ? Math.max(0, delay) : 0;
  } catch {
    return 0;
  }
}

function isCacheableHtmlRequest(request) {
  return request.method === 'GET' && delayFromRequest(request) <= 0;
}

function applyHtmlCacheHeaders(headers) {
  headers.set('Cache-Control', HTML_CACHE_CONTROL);
  headers.set('CDN-Cache-Control', HTML_CACHE_CONTROL);
  headers.set('Vercel-CDN-Cache-Control', HTML_CACHE_CONTROL);
  headers.set('Netlify-CDN-Cache-Control', HTML_CACHE_CONTROL);
}

async function platformGet(key) {
  try {
    if (isVercel()) {
      const { getCache } = await import('@vercel/functions');
      const value = await getCache({ namespace: 'catalog' }).get(key);
      if (value != null) return value;
      return;
    }
  } catch {
    // Optional dependency / not running on Vercel.
  }

  try {
    if (isNetlify()) {
      const { getStore } = await import('@netlify/blobs');
      const stored = await getStore('catalog-cache').get(key, { type: 'json' });
      if (stored && stored.expiresAt > Date.now()) return stored.value;
      return;
    }
  } catch {
    // Optional dependency / not running on Netlify.
  }

  try {
    const cache = edgeCache();
    if (cache) {
      const hit = await cache.match(edgeRequest(key));
      if (hit?.ok) return hit.json();
    }
  } catch {
    // Ignore Cache API failures.
  }
}

async function platformSet(key, value) {
  try {
    if (isVercel()) {
      const { getCache } = await import('@vercel/functions');
      await getCache({ namespace: 'catalog' }).set(key, value, {
        tags: ['catalog'],
        ttl: CATALOG_CACHE_REVALIDATE_SECONDS,
      });
      return;
    }
  } catch {
    // Optional dependency / not running on Vercel.
  }

  try {
    if (isNetlify()) {
      const { getStore } = await import('@netlify/blobs');
      await getStore('catalog-cache').setJSON(key, {
        expiresAt: Date.now() + TTL_MS,
        value,
      });
      return;
    }
  } catch {
    // Optional dependency / not running on Netlify.
  }

  try {
    const cache = edgeCache();
    if (cache) {
      await cache.put(
        edgeRequest(key),
        new Response(JSON.stringify(value), {
          headers: {
            'Cache-Control': `max-age=${CATALOG_CACHE_REVALIDATE_SECONDS}`,
            'Content-Type': 'application/json',
          },
        }),
      );
    }
  } catch {
    // Ignore Cache API write failures.
  }
}

export async function cacheLifeHours(key, load) {
  const cached = memoryGet(key);
  if (cached !== undefined) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const next = (async () => {
    const remote = await platformGet(key);
    if (remote !== undefined) {
      memorySet(key, remote);
      return remote;
    }

    const value = await load();
    memorySet(key, value);
    await platformSet(key, value);
    return value;
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, next);
  return next;
}

export function withTtlCache(name, fn) {
  return (...args) => cacheLifeHours(`${name}:${JSON.stringify(args)}`, () => fn(...args));
}

export async function matchCachedHtml(request) {
  if (!isCacheableHtmlRequest(request)) return;
  const cache = edgeCache();
  if (!cache) return;
  try {
    const hit = await cache.match(request);
    return hit?.ok ? hit : undefined;
  } catch {
    return;
  }
}

export async function storeCachedHtml(request, response) {
  if (!isCacheableHtmlRequest(request) || !response.ok) return;
  if (!response.headers.get('content-type')?.includes('text/html')) return;
  const cache = edgeCache();
  if (!cache) return;
  try {
    const copy = response.clone();
    applyHtmlCacheHeaders(copy.headers);
    await cache.put(request, copy);
  } catch {
    // Best-effort HTML edge cache.
  }
}

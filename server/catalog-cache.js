/** Matches Next cacheLife('hours'): revalidate 1h, expire 24h. */
export const CATALOG_CACHE_REVALIDATE_SECONDS = 3600;
export const CATALOG_CACHE_EXPIRE_SECONDS = 86400;

/** Match next-books HTML Cache-Control per host (Vercel vs Netlify/Cloudflare/local). */
export const VERCEL_DOCUMENT_CACHE_CONTROL = 'public, max-age=0, must-revalidate';
export const PRIVATE_DOCUMENT_CACHE_CONTROL =
  'private, no-cache, no-store, max-age=0, must-revalidate';

const TTL_MS = CATALOG_CACHE_REVALIDATE_SECONDS * 1000;

const memory = new Map();
const inflight = new Map();

function isVercel() {
  return Boolean(envFlag('VERCEL')) && !envFlag('CLOUDFLARE');
}

function isNetlify() {
  return (
    Boolean(envFlag('NETLIFY') || envFlag('NETLIFY_BLOBS_CONTEXT')) &&
    !envFlag('CLOUDFLARE') &&
    !envFlag('VERCEL')
  );
}

/** Public document Cache-Control matching next-books on this host. */
export function hostDocumentCacheControl() {
  return isVercel() ? VERCEL_DOCUMENT_CACHE_CONTROL : PRIVATE_DOCUMENT_CACHE_CONTROL;
}

function memoryGet(key) {
  const hit = memory.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
}

function memorySet(key, value) {
  memory.set(key, { expiresAt: Date.now() + TTL_MS, value });
}

let catalogKv;

/** Bind Workers KV so catalog queries persist across isolates (like Next `use cache`). */
export function bindCatalogCache(kv) {
  if (kv) catalogKv = kv;
}

function edgeRequest(key) {
  return new Request(
    `https://example.com/books-catalog-cache/v1/${encodeURIComponent(key)}`,
  );
}

function edgeCache() {
  return globalThis.caches?.default;
}

function envFlag(name) {
  try {
    return typeof process !== 'undefined' ? process.env?.[name] : undefined;
  } catch {
    return undefined;
  }
}

async function platformGet(key) {
  try {
    if (catalogKv) {
      const value = await catalogKv.get(key, 'json');
      if (value != null) return value;
      return;
    }
  } catch {
    // KV optional / not bound.
  }

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
      const stored = await getStore({
        name: 'catalog-cache',
        consistency: 'strong',
      }).get(key, { type: 'json' });
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
    if (catalogKv) {
      await catalogKv.put(key, JSON.stringify(value), {
        expirationTtl: CATALOG_CACHE_REVALIDATE_SECONDS,
      });
      return;
    }
  } catch {
    // KV optional / not bound.
  }

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
      await getStore({ name: 'catalog-cache', consistency: 'strong' }).setJSON(key, {
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

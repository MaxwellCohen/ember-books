import {
  bookPayload,
  cacheHeadersFor,
  catalogPayload,
  searchParamsFromUrl,
} from '../server/catalog-api.js';

function applySecrets(env) {
  if (env?.POSTGRES_URL) process.env.POSTGRES_URL = env.POSTGRES_URL;
  if (env?.API_DELAY_MS) process.env.API_DELAY_MS = String(env.API_DELAY_MS);
}

function jsonWithCache(body, searchParams, init = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      ...cacheHeadersFor(searchParams),
      ...init.headers,
    },
  });
}

export default {
  async fetch(request, env) {
    applySecrets(env);

    const url = new URL(request.url);
    if (url.pathname === '/api/catalog') {
      const searchParams = searchParamsFromUrl(url.href);
      return jsonWithCache(await catalogPayload(searchParams), searchParams);
    }

    const bookMatch = url.pathname.match(/^\/api\/books\/([^/]+)$/);
    if (bookMatch) {
      const searchParams = searchParamsFromUrl(url.href);
      const book = await bookPayload(
        decodeURIComponent(bookMatch[1]),
        searchParams,
      );
      if (!book) {
        return Response.json({ error: 'Book not found' }, { status: 404 });
      }
      return jsonWithCache(book, searchParams);
    }

    return env.ASSETS.fetch(request);
  },
};

import { bookPayload, catalogPayload, searchParamsFromUrl } from '../server/catalog-api.js';

function applySecrets(env) {
  if (env?.POSTGRES_URL) process.env.POSTGRES_URL = env.POSTGRES_URL;
  if (env?.API_DELAY_MS) process.env.API_DELAY_MS = String(env.API_DELAY_MS);
}

export default {
  async fetch(request, env) {
    applySecrets(env);

    const url = new URL(request.url);
    if (url.pathname === '/api/catalog') {
      return Response.json(await catalogPayload(searchParamsFromUrl(url.href)));
    }

    const bookMatch = url.pathname.match(/^\/api\/books\/([^/]+)$/);
    if (bookMatch) {
      const book = await bookPayload(
        decodeURIComponent(bookMatch[1]),
        searchParamsFromUrl(url.href),
      );
      if (!book) {
        return Response.json({ error: 'Book not found' }, { status: 404 });
      }
      return Response.json(book);
    }

    return env.ASSETS.fetch(request);
  },
};

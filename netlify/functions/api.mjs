import '../../server/load-env.js';
import {
  bookPayload,
  cacheHeadersFor,
  catalogPayload,
  searchParamsFromUrl,
} from '../../server/catalog-api.js';

function originalPath(event) {
  const path = event.path || '/';
  if (path.startsWith('/.netlify/functions/api')) {
    const rest = path.slice('/.netlify/functions/api'.length);
    return rest ? `/api${rest}` : '/api';
  }
  return path.startsWith('/api') ? path : `/api${path}`;
}

export async function handler(event) {
  const host = event.headers.host || 'localhost';
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const query = event.rawQuery
    ? `?${event.rawQuery}`
    : event.queryStringParameters
      ? `?${new URLSearchParams(event.queryStringParameters)}`
      : '';
  const url = `${proto}://${host}${originalPath(event)}${query}`;
  const parsed = new URL(url);

  if (parsed.pathname === '/api/catalog') {
    const searchParams = searchParamsFromUrl(url);
    const payload = await catalogPayload(searchParams);
    return {
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        ...cacheHeadersFor(searchParams),
      },
      statusCode: 200,
    };
  }

  const bookMatch = parsed.pathname.match(/^\/api\/books\/([^/]+)$/);
  if (bookMatch) {
    const searchParams = searchParamsFromUrl(url);
    const book = await bookPayload(
      decodeURIComponent(bookMatch[1]),
      searchParams,
    );
    if (!book) {
      return {
        body: JSON.stringify({ error: 'Book not found' }),
        headers: { 'content-type': 'application/json' },
        statusCode: 404,
      };
    }
    return {
      body: JSON.stringify(book),
      headers: {
        'content-type': 'application/json',
        ...cacheHeadersFor(searchParams),
      },
      statusCode: 200,
    };
  }

  return { body: 'Not found', statusCode: 404 };
}

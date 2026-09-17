import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleHTML, createEmberApp } from 'vite-ember-ssr/server';
import {
  bookPayload,
  cacheHeadersFor,
  catalogPayload,
  searchParamsFromUrl,
} from './catalog-api.js';
import { matchCachedHtml, storeCachedHtml } from './catalog-cache.js';

function jsonWithCache(body, searchParams, init = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      ...cacheHeadersFor(searchParams),
      ...init.headers,
    },
  });
}

const root = fileURLToPath(new URL('..', import.meta.url));

let templatePromise;
let emberAppPromise;

function getTemplate() {
  templatePromise ??= readFile(
    resolve(root, 'dist/server/template.html'),
    'utf8',
  );
  return templatePromise;
}

function getEmberApp() {
  emberAppPromise ??= createEmberApp(resolve(root, 'dist/server/app-ssr.js'), {
    workers: 1,
  });
  return emberAppPromise;
}

export async function handleFetch(request, options = {}) {
  const url = new URL(request.url);
  const ssr = options.ssr !== false;

  if (url.pathname === '/api/catalog') {
    const searchParams = searchParamsFromUrl(url.href);
    return jsonWithCache(await catalogPayload(searchParams), searchParams);
  }

  if (url.pathname === '/api/books/count') {
    const searchParams = searchParamsFromUrl(url.href);
    const { total } = await catalogPayload(searchParams);
    return jsonWithCache(total, searchParams);
  }

  if (url.pathname === '/api/books') {
    const searchParams = searchParamsFromUrl(url.href);
    const { books } = await catalogPayload(searchParams);
    return jsonWithCache(books, searchParams);
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

  if (!ssr) {
    return new Response('Not found', { status: 404 });
  }

  const cachedHtml = await matchCachedHtml(request);
  if (cachedHtml) return cachedHtml;

  const searchParams = searchParamsFromUrl(url.href);
  const [template, emberApp] = await Promise.all([
    getTemplate(),
    getEmberApp(),
  ]);
  const rendered = await emberApp.renderRoute(`${url.pathname}${url.search}`, {
    settledTimeout: 8000,
  });
  if (rendered.error) console.error(rendered.error);
  const response = new Response(assembleHTML(template, rendered), {
    headers: {
      ...cacheHeadersFor(searchParams),
      'content-type': 'text/html; charset=utf-8',
    },
    status: rendered.statusCode,
  });
  void storeCachedHtml(request, response);
  return response;
}

export async function handleNodeRequest(req, res) {
  const host = req.headers.host ?? 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const request = new Request(`${proto}://${host}${req.url ?? '/'}`, {
    headers: req.headers,
    method: req.method,
  });
  const response = await handleFetch(request);
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}

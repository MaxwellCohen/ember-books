import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleHTML, createEmberApp } from 'vite-ember-ssr/server';
import {
  bookPayload,
  catalogPayload,
  searchParamsFromUrl,
} from './catalog-api.js';

const root = fileURLToPath(new URL('..', import.meta.url));

let templatePromise;
let emberAppPromise;

function getTemplate() {
  templatePromise ??= readFile(resolve(root, 'dist/server/template.html'), 'utf8');
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
    return Response.json(await catalogPayload(searchParamsFromUrl(url.href)));
  }

  if (url.pathname === '/api/books/count') {
    const { total } = await catalogPayload(searchParamsFromUrl(url.href));
    return Response.json(total);
  }

  if (url.pathname === '/api/books') {
    const { books } = await catalogPayload(searchParamsFromUrl(url.href));
    return Response.json(books);
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

  if (!ssr) {
    return new Response('Not found', { status: 404 });
  }

  const [template, emberApp] = await Promise.all([getTemplate(), getEmberApp()]);
  const rendered = await emberApp.renderRoute(`${url.pathname}${url.search}`, {
    settledTimeout: 8000,
  });
  if (rendered.error) console.error(rendered.error);
  return new Response(assembleHTML(template, rendered), {
    headers: { 'content-type': 'text/html; charset=utf-8' },
    status: rendered.statusCode,
  });
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

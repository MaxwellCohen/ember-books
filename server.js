import './server/load-env.js';
import Fastify from 'fastify';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleHTML, createEmberApp } from 'vite-ember-ssr/server';
import {
  bookPayload,
  cacheControlFor,
  catalogPayload,
  searchParamsFromUrl,
} from './server/catalog-api.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const isDev = process.argv.includes('--dev');
const dist = resolve(root, 'dist');

function isAsset(url) {
  return /\.(js|mjs|css|map|ico|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|webp|avif)(\?.*)?$/.test(
    url,
  );
}

function shouldSSR(url) {
  const path = (url || '/').split('?')[0];
  if (path.startsWith('/api/')) return false;
  if (path.startsWith('/@')) return false;
  if (path.startsWith('/node_modules')) return false;
  if (path.startsWith('/app/')) return false;
  if (path.startsWith('/assets/')) return false;
  if (isAsset(url)) return false;
  return true;
}

async function registerApi(app) {
  app.get('/api/catalog', async (request, reply) => {
    const searchParams = searchParamsFromUrl(request.url);
    reply.header('cache-control', cacheControlFor(searchParams));
    return catalogPayload(searchParams);
  });

  app.get('/api/books/count', async (request, reply) => {
    const searchParams = searchParamsFromUrl(request.url);
    const { total } = await catalogPayload(searchParams);
    reply.header('cache-control', cacheControlFor(searchParams));
    return total;
  });

  app.get('/api/books', async (request, reply) => {
    const searchParams = searchParamsFromUrl(request.url);
    const { books } = await catalogPayload(searchParams);
    reply.header('cache-control', cacheControlFor(searchParams));
    return books;
  });

  app.get('/api/books/:id', async (request, reply) => {
    const searchParams = searchParamsFromUrl(request.url);
    const book = await bookPayload(request.params.id, searchParams);
    if (!book) return reply.code(404).send({ error: 'Book not found' });
    reply.header('cache-control', cacheControlFor(searchParams));
    return book;
  });
}

async function renderHtml(emberApp, url, template) {
  const rendered = await emberApp.renderRoute(url, { settledTimeout: 8000 });
  const html = assembleHTML(template, rendered);
  return { html, rendered };
}

async function setupDev(app) {
  const { createServer } = await import('vite');
  process.chdir(root);

  const vite = await createServer({
    appType: 'custom',
    root,
    server: { middlewareMode: true },
  });

  await app.register(import('@fastify/middie'));
  app.use((req, res, next) => {
    if (shouldSSR(req.originalUrl || req.url)) return next();
    vite.middlewares(req, res, next);
  });

  const emberApp = await createEmberApp(resolve(root, 'app/app-ssr.js'), {
    dev: { ssrLoadModule: vite.ssrLoadModule.bind(vite) },
  });

  await registerApi(app);

  app.get('*', async (request, reply) => {
    if (!shouldSSR(request.url)) return;

    try {
      request.log.info({ url: request.url }, 'ssr:start');
      let template = await readFile(resolve(root, 'index.html'), 'utf8');
      template = await vite.transformIndexHtml(request.url, template);
      const { html, rendered } = await renderHtml(
        emberApp,
        request.url,
        template,
      );
      request.log.info({ status: rendered.statusCode }, 'ssr:done');
      if (rendered.error) request.log.error(rendered.error);
      return reply
        .code(rendered.statusCode)
        .type('text/html')
        .header(
          'cache-control',
          cacheControlFor(searchParamsFromUrl(request.url)),
        )
        .send(html);
    } catch (error) {
      if (error instanceof Error) vite.ssrFixStacktrace(error);
      request.log.error(error);
      return reply
        .code(500)
        .type('text/plain')
        .send(error instanceof Error ? error.stack : String(error));
    }
  });

  return emberApp;
}

async function setupProd(app) {
  await app.register(import('@fastify/compress'));
  await app.register(import('@fastify/static'), {
    index: false,
    prefix: '/',
    root: resolve(dist, 'client'),
    wildcard: false,
  });

  const template = await readFile(
    resolve(dist, 'server/template.html'),
    'utf8',
  );
  const emberApp = await createEmberApp(resolve(dist, 'server/app-ssr.js'), {
    workers: 1,
  });

  await registerApi(app);

  app.get('*', async (request, reply) => {
    if (!shouldSSR(request.url)) return;

    try {
      const { html, rendered } = await renderHtml(
        emberApp,
        request.url,
        template,
      );
      if (rendered.error) request.log.error(rendered.error);
      return reply
        .code(rendered.statusCode)
        .type('text/html')
        .header(
          'cache-control',
          cacheControlFor(searchParamsFromUrl(request.url)),
        )
        .send(html);
    } catch (error) {
      request.log.error(error);
      return reply
        .code(500)
        .type('text/plain')
        .send(error instanceof Error ? error.stack : String(error));
    }
  });

  return emberApp;
}

const app = Fastify({ logger: true });
const emberApp = await (isDev ? setupDev(app) : setupProd(app));
const port = Number(process.env.PORT || 4200);

await app.listen({ host: '0.0.0.0', port });

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await emberApp.destroy();
    await app.close();
    process.exit(0);
  });
}

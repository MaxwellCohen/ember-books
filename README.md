<div align="center">

<img src="public/logo.svg" alt="Ember Books" width="72" height="72" />

# Ember Books

Ember Books is the Ember port of the shared Goodreads catalog app. It uses [Ember 7](https://emberjs.com/) with Vite SSR, URL-driven search and filters, and the same preview shelf as the other books apps when no database is connected.

</div>

---

Rebuild of [vercel-labs/book-inventory](https://github.com/vercel-labs/book-inventory), now archived. [Full dataset here](https://mengtingwan.github.io/data/goodreads.html).

## Run locally

```bash
npm install
cp .env.sample .env
# Set POSTGRES_URL to use the shared Neon catalog, or leave it blank for the preview shelf.
npm start
```

<div align="center">

<img src="public/logo.svg" alt="Ember Books" width="72" height="72" />

# Ember Books

Ember Books is the Ember port of the shared Goodreads catalog app. It uses [Ember 7](https://emberjs.com/) with Vite SSR, URL-driven search and filters, and the same preview shelf as the other books apps when no database is connected.

</div>

---

Rebuild of [vercel-labs/book-inventory](https://github.com/vercel-labs/book-inventory), now archived. [Full dataset here](https://mengtingwan.github.io/data/goodreads.html).

## Run locally

```bash
npm install
cp .env.sample .env
# Set POSTGRES_URL to use the shared Neon catalog, or leave it blank for the preview shelf.
npm start
```

Visit [http://localhost:4200](http://localhost:4200). Without a database the app serves a small preview catalog so search, filters, pagination, and book pages still work.

```bash
npm run lint
npm test
```

## Deploy

```bash
npm run deploy:vercel
npm run deploy:netlify
npm run deploy:cloudflare
```

Set `POSTGRES_URL` (and optionally `API_DELAY_MS`) on each host. Cloudflare uses `wrangler secret put POSTGRES_URL`.


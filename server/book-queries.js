import { and, count, eq, gte, isNull, lte, not, sql } from 'drizzle-orm';
import {
  EMPTY_IMAGE_URL,
  ITEMS_PER_PAGE,
  MIN_RATING,
  MIN_YEAR,
} from '../app/lib/book/book-constants.js';
import {
  getBookById as getPreviewBookById,
  getBooksCount as getPreviewCount,
  getBooksPage as getPreviewPage,
} from '../app/lib/book/book-queries.js';
import { getDb } from './db/drizzle.js';
import { authors, books, bookToAuthor } from './db/schema.js';
import { withTtlCache } from './catalog-cache.js';

const yearFilter = (year) =>
  and(gte(books.publication_year, MIN_YEAR), lte(books.publication_year, year));

const ratingFilter = (rating) =>
  rating > MIN_RATING ? sql`${books.average_rating} >= ${rating}` : undefined;

const languageFilter = (language) => {
  if (!language) return undefined;
  if (language === 'en') {
    return sql`${books.language_code} IN ('eng', 'en-US', 'en-GB')`;
  }
  return eq(books.language_code, language);
};

const pageCountFilter = (maxPages) => lte(books.num_pages, maxPages);

const imageFilter = () =>
  and(
    not(isNull(books.image_url)),
    sql`${books.image_url} != ${EMPTY_IMAGE_URL}`,
  );

const searchFilter = (search) =>
  search
    ? sql`to_tsvector('english', ${books.title_tsv}) @@ (
        SELECT string_agg(quote_literal(term) || ':*', ' & ')::tsquery
        FROM unnest(tsvector_to_array(to_tsvector('english', unaccent(${search})))) AS terms(term)
      )`
    : undefined;

const isbnFilter = (isbns) => {
  if (!isbns) return undefined;
  const values = isbns.split(',').map((value) => value.trim());
  return sql`${books.isbn} IN (${sql.join(
    values.map((value) => sql`${value}`),
    sql`, `,
  )})`;
};

function getWhereClause({ isbns, language, maxPages, rating, search, year }) {
  const filters = [
    yearFilter(year),
    ratingFilter(rating),
    languageFilter(language),
    pageCountFilter(maxPages),
    imageFilter(),
    searchFilter(search),
    isbnFilter(isbns),
  ].filter((filter) => filter !== undefined);

  return filters.length ? and(...filters) : undefined;
}

async function queryBooksPage(query) {
  const database = getDb();
  if (!database) return getPreviewPage(query);

  return database
    .select({
      id: books.id,
      image_url: books.image_url,
      thumbhash: books.thumbhash,
      title: books.title,
    })
    .from(books)
    .where(getWhereClause(query))
    .orderBy(books.id)
    .limit(ITEMS_PER_PAGE)
    .offset((query.page - 1) * ITEMS_PER_PAGE);
}

async function queryBooksCount(filters) {
  const database = getDb();
  if (!database) return getPreviewCount(filters);

  const [{ total }] = await database
    .select({ total: count() })
    .from(books)
    .where(getWhereClause(filters));
  return total;
}

async function queryBookById(id) {
  const bookId = Number(id);
  if (!Number.isInteger(bookId)) return null;

  const database = getDb();
  if (!database) return getPreviewBookById(id);

  const result = await database
    .select({
      authors: sql`array_remove(array_agg(${authors.name}), NULL)`,
      average_rating: books.average_rating,
      description: books.description,
      id: books.id,
      image_url: books.image_url,
      isbn: books.isbn,
      language_code: books.language_code,
      num_pages: books.num_pages,
      publication_year: books.publication_year,
      publisher: books.publisher,
      ratings_count: books.ratings_count,
      thumbhash: books.thumbhash,
      title: books.title,
    })
    .from(books)
    .leftJoin(bookToAuthor, eq(books.id, bookToAuthor.bookId))
    .leftJoin(authors, eq(bookToAuthor.authorId, authors.id))
    .where(eq(books.id, bookId))
    .groupBy(books.id)
    .limit(1);

  return result[0] ?? null;
}

export const getBooksPage = withTtlCache('getBooksPage', queryBooksPage);
export const getBooksCount = withTtlCache('getBooksCount', queryBooksCount);
export const getBookById = withTtlCache('getBookById', queryBookById);

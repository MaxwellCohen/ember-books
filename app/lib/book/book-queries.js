import { EMPTY_IMAGE_URL, ITEMS_PER_PAGE, MIN_YEAR } from './book-constants.js';
import { GENERATED_PREVIEW_BOOKS } from './book-preview-catalog.js';
import { SAMPLE_BOOKS } from './data/sample-books.js';

const previewBooks = [...SAMPLE_BOOKS, ...GENERATED_PREVIEW_BOOKS];

function filterPreview({ isbns, language, maxPages, rating, search, year }) {
  const query = search.toLocaleLowerCase();
  const isbnList = isbns ? isbns.split(',') : undefined;

  return previewBooks.filter((book) => {
    const matchesQuery =
      !query || book.title.toLocaleLowerCase().includes(query);
    const matchesLanguage =
      !language ||
      (language === 'en'
        ? ['eng', 'en-US', 'en-GB'].includes(book.language_code ?? '')
        : book.language_code === language);

    return (
      matchesQuery &&
      matchesLanguage &&
      book.image_url !== EMPTY_IMAGE_URL &&
      (!isbnList || (!!book.isbn && isbnList.includes(book.isbn))) &&
      (book.publication_year ?? 0) >= MIN_YEAR &&
      (book.publication_year ?? Infinity) <= year &&
      Number(book.average_rating ?? 0) >= rating &&
      (book.num_pages ?? 0) <= maxPages
    );
  });
}

export function getBooksPage(query) {
  const start = (query.page - 1) * ITEMS_PER_PAGE;
  return filterPreview(query).slice(start, start + ITEMS_PER_PAGE);
}

export function getBooksCount(filters) {
  return filterPreview(filters).length;
}

export function getBookById(id) {
  const bookId = Number(id);
  if (!Number.isInteger(bookId)) return null;
  return previewBooks.find((book) => book.id === bookId) ?? null;
}

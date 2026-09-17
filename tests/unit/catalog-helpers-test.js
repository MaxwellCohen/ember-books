import { module, test } from 'qunit';
import { setupTest } from 'ember-books/tests/helpers';
import {
  getBookById,
  getBooksCount,
  getBooksPage,
} from 'ember-books/lib/book/book-queries';
import { toBookFilters, toBookQuery } from 'ember-books/lib/book/book-utils';
import {
  getCurrentPage,
  withFilters,
  withPage,
} from 'ember-books/lib/url-state';

module('Unit | catalog helpers', function (hooks) {
  setupTest(hooks);

  test('toBookQuery maps URL params onto catalog filters', function (assert) {
    const query = toBookQuery({
      language: 'fre',
      list: 'popular',
      page: '2',
      pages: '400',
      rating: '4',
      search: '  wizard  ',
      year: '2000',
    });

    assert.strictEqual(query.language, 'fre');
    assert.true(query.isbns.includes('0671027034'));
    assert.strictEqual(query.page, 2);
    assert.strictEqual(query.maxPages, 400);
    assert.strictEqual(query.rating, 4);
    assert.strictEqual(query.search, 'wizard');
    assert.strictEqual(query.year, 2000);
  });

  test('preview catalog search and pagination match the sample shelf', function (assert) {
    const wizard = toBookQuery({ search: 'wizard' });
    const books = getBooksPage(wizard);
    const total = getBooksCount(toBookFilters(wizard));

    assert.strictEqual(total, 1);
    assert.strictEqual(books[0]?.title, 'The Unschooled Wizard');
    assert.strictEqual(
      getBookById('5333265')?.title,
      'W.C. Fields: A Life on Film',
    );
    assert.strictEqual(getBookById('not-a-book'), null);
  });

  test('withFilters drops page and empty values', function (assert) {
    const next = withFilters(
      { delay: '250', page: '2', search: 'wizard' },
      { rating: '4', search: '' },
    );
    assert.deepEqual(next, { delay: '250', rating: '4' });
    assert.deepEqual(withPage(next, 3), {
      delay: '250',
      page: '3',
      rating: '4',
    });
    assert.strictEqual(getCurrentPage({ page: '2' }, 4), 2);
  });
});

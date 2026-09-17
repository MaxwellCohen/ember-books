import { module, test } from 'qunit';
import {
  click,
  currentURL,
  fillIn,
  findAll,
  select,
  triggerEvent,
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-books/tests/helpers';

function buttonByText(text) {
  return [...document.querySelectorAll('button')].find(
    (element) => element.textContent.trim() === text,
  );
}

async function nudgeSlider(assert, nth, expected) {
  const slider = findAll('input[type="range"]').filter(
    (input) => input.offsetParent !== null,
  )[nth];
  assert.ok(slider, `slider ${nth} exists`);
  slider.value = String(Number(slider.min) + 1);
  await triggerEvent(slider, 'input');
  assert.true(currentURL().includes(expected), `URL includes ${expected}`);
}

module('Acceptance | catalog', function (hooks) {
  setupApplicationTest(hooks);

  test('the home page shows the catalog shell and a sample book', async function (assert) {
    await visit('/');

    assert.dom('[role="search"] input').exists();
    assert.dom('main').includesText('W.C. Fields');
    assert.dom('nav[aria-label="Pagination"]').exists();
  });

  test('pagination moves between catalog pages', async function (assert) {
    await visit('/');
    await click('[aria-label="Next page"]');

    assert.strictEqual(
      new URL(currentURL(), 'http://localhost').searchParams.get('page'),
      '2',
    );
    assert.dom('nav[aria-label="Pagination"]').includesText('Page 2 of');

    await click('[aria-label="Previous page"]');
    assert.strictEqual(
      new URL(currentURL(), 'http://localhost').searchParams.get('page'),
      null,
    );
    assert.dom('nav[aria-label="Pagination"]').includesText('Page 1 of');
  });

  test('search filters matching books and can be cleared', async function (assert) {
    await visit('/');
    await fillIn('[role="search"] input', 'wizard');

    assert.strictEqual(
      new URL(currentURL(), 'http://localhost').searchParams.get('search'),
      'wizard',
    );
    assert.dom('main').includesText('Unschooled Wizard');

    await click('[aria-label="Clear search"]');
    assert.strictEqual(currentURL(), '/');
    assert.dom('main').includesText('W.C. Fields');
  });

  test('a query with no matches renders the empty state', async function (assert) {
    await visit('/');
    await fillIn('[role="search"] input', 'zzzznotarealtitle');

    assert.dom('main').includesText('No books found');
  });

  test('filters update the URL and can be cleared', async function (assert) {
    await visit('/?page=2');
    await nudgeSlider(assert, 2, 'rating=0.5');
    assert.strictEqual(
      new URL(currentURL(), 'http://localhost').searchParams.get('page'),
      null,
    );

    const clear = buttonByText('Clear all filters');
    assert.ok(clear, 'clear filters button is visible');
    await click(clear);
    assert.strictEqual(currentURL(), '/');
    assert.strictEqual(buttonByText('Clear all filters'), undefined);
  });

  test('the language filter and book lists drive readable URL state', async function (assert) {
    await visit('/');
    await select('#desktop-filter-language', 'fre');
    assert.strictEqual(
      new URL(currentURL(), 'http://localhost').searchParams.get('language'),
      'fre',
    );

    const list = [...document.querySelectorAll('input[type="checkbox"]')].find(
      (input) =>
        input.closest('label')?.textContent.includes('Sci-Fi & Fantasy'),
    );
    await click(list);
    assert.strictEqual(
      new URL(currentURL(), 'http://localhost').searchParams.get('list'),
      'sci-fi-fantasy',
    );
  });

  test('opening a book and returning keeps catalog filters', async function (assert) {
    await visit('/?search=wizard');
    await click('a[href^="/7327624"]');

    assert.dom('h1').hasText('The Unschooled Wizard');
    assert.dom(buttonByText('Back to books')).exists();

    await click(buttonByText('Back to books'));
    assert.strictEqual(currentURL(), '/?search=wizard');
    assert.dom('[role="search"] input').hasValue('wizard');
    assert.dom('main').includesText('Unschooled Wizard');
  });

  test('an unknown book id renders the not-found state', async function (assert) {
    await visit('/99999999');
    assert.dom().includesText('Book not found');
  });
});

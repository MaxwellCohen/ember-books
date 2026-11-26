import Route from '@ember/routing/route';
import { loadBook, takePrefetchedBook } from '../lib/book/load-catalog';
import { catalogRouteQueryParams, parseSearchParams } from '../lib/url-state';

export default class BookRoute extends Route {
  queryParams = catalogRouteQueryParams;

  model(params) {
    const searchParams = parseSearchParams(params);
    return (
      takePrefetchedBook(params.id, searchParams) ??
      loadBook(params.id, searchParams)
    );
  }
}

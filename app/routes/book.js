import Route from '@ember/routing/route';
import { loadBook } from '../lib/book/load-catalog';
import { catalogRouteQueryParams, parseSearchParams } from '../lib/url-state';

export default class BookRoute extends Route {
  queryParams = catalogRouteQueryParams;

  model(params) {
    return loadBook(params.id, parseSearchParams(params));
  }
}

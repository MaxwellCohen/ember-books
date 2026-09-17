import Route from '@ember/routing/route';
import { loadCatalog } from '../lib/book/load-catalog';
import { catalogRouteQueryParams, parseSearchParams } from '../lib/url-state';

export default class IndexRoute extends Route {
  queryParams = catalogRouteQueryParams;

  model(params) {
    return loadCatalog(parseSearchParams(params));
  }
}

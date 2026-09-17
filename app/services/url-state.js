import Service, { service } from '@ember/service';
import {
  parseSearchParams,
  toEmberQueryParams,
  withFilters,
} from '../lib/url-state';

export default class UrlStateService extends Service {
  @service router;

  get params() {
    return parseSearchParams(this.router.currentRoute?.queryParams ?? {});
  }

  replaceIndex(params) {
    return this.router.replaceWith('index', {
      queryParams: toEmberQueryParams(params),
    });
  }

  updateFilters(patch) {
    return this.replaceIndex(withFilters(this.params, patch));
  }
}

import Controller from '@ember/controller';
import { service } from '@ember/service';
import { catalogControllerQueryParams } from '../lib/url-state';

export default class IndexController extends Controller {
  @service pending;

  queryParams = catalogControllerQueryParams;

  delay = '';
  language = '';
  list = '';
  page = '';
  pages = '';
  rating = '';
  search = '';
  year = '';
}

import Controller from '@ember/controller';
import { catalogControllerQueryParams } from '../lib/url-state';

export default class BookController extends Controller {
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

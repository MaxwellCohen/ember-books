import EmberApp from 'ember-strict-application-resolver';
import PageTitleService from 'ember-page-title/services/page-title';
import Router from './router';

export default class App extends EmberApp {
  modules = {
    './router': { default: Router },
    './services/page-title': { default: PageTitleService },
    ...import.meta.glob('./services/**/*.js', { eager: true }),
    ...import.meta.glob('./routes/**/*.js', { eager: true }),
    ...import.meta.glob('./controllers/**/*.js', { eager: true }),
    ...import.meta.glob('./templates/**/*.gjs', { eager: true }),
    ...import.meta.glob('./components/**/*.gjs', { eager: true }),
  };
}

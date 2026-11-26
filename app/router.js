import EmberRouter from '@embroider/router';
import config from 'ember-books/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('feature-tests', function () {
    this.route('css-inlining');
    this.route('font-optimization');
    this.route('image-pipeline');
    this.route('caching');
    this.route('route-prefetching');
    this.route('islands');
    this.route('render-modes', function () {
      this.route('server');
      this.route('client');
    });
    this.route('reactivity');
    this.route('bundle-analysis');
    this.route('third-party-scripts');
    this.route('multi-host-deployment');
  });
  this.route('book', { path: '/:id' });
  this.route('not-found', { path: '/*path' });
});

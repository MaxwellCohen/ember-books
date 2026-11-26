import Route from '@ember/routing/route';

export default class FeatureTestsCachingRoute extends Route {
  async model() {
    if (import.meta.env.SSR) {
      const { cachedTimestamp } = await import('../../../server/feature-tests.js');
      return cachedTimestamp();
    }
    const response = await fetch('/api/feature-tests/cached-time');
    return response.json();
  }
}

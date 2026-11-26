import Route from '@ember/routing/route';

export default class RenderModesClientRoute extends Route {
  model() {
    return {
      mode: import.meta.env.SSR ? 'server' : 'client',
      renderedAt: new Date().toISOString(),
    };
  }
}

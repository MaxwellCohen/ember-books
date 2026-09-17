import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PendingService extends Service {
  @service router;
  @tracked isPending = false;

  constructor() {
    super(...arguments);

    this.router.on('routeWillChange', (transition) => {
      if (!transition.from) return;
      this.isPending = true;
    });

    this.router.on('routeDidChange', () => {
      this.isPending = false;
    });
  }
}

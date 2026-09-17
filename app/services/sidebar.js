import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SidebarService extends Service {
  @tracked isOpen = false;

  open = () => {
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };
}

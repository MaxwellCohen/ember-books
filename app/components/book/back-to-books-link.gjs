import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { cn } from '../../lib/utils';
import { toEmberQueryParams } from '../../lib/url-state';
import { ArrowLeftIcon } from '../ui/icons';

const linkClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white';

export default class BackToBooksLink extends Component {
  @service router;
  @service urlState;

  get query() {
    return toEmberQueryParams(this.urlState.params);
  }

  get className() {
    return cn(linkClass, this.args.class);
  }

  goBack = () => {
    this.router.transitionTo('index', { queryParams: this.query });
  };

  <template>
    <button class={{this.className}} type="button" {{on "click" this.goBack}}>
      <ArrowLeftIcon />
      Back to books
    </button>
  </template>
}

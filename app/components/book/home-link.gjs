import Component from '@glimmer/component';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import { toEmberQueryParams } from '../../lib/url-state';
import BookMark from '../ui/book-mark';

export default class HomeLink extends Component {
  @service urlState;

  get query() {
    return toEmberQueryParams({ delay: this.urlState.params.delay });
  }

  <template>
    <LinkTo
      @query={{this.query}}
      @route="index"
      aria-label="Ember Books home"
      class="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
    >
      <BookMark @class="text-action size-5" />
      Ember Books
    </LinkTo>
  </template>
}

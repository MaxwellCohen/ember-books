import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import {
  API_DELAY_VALUES,
  formatApiDelay,
  getApiDelayMs,
  toEmberQueryParams,
} from '../../lib/url-state';
import Range from '../ui/range';

export default class ApiDelay extends Component {
  @service router;
  @service urlState;

  @tracked draft = null;

  constructor() {
    super(...arguments);
    this.router.on('routeDidChange', this.syncFromUrl);
  }

  willDestroy() {
    super.willDestroy();
    this.router.off('routeDidChange', this.syncFromUrl);
  }

  get value() {
    return this.draft ?? getApiDelayMs(this.urlState.params);
  }

  get readout() {
    return formatApiDelay(this.value);
  }

  get values() {
    return API_DELAY_VALUES;
  }

  syncFromUrl = () => {
    this.draft = null;
  };

  onValue = (next) => {
    this.draft = next;
    const params = {
      ...this.urlState.params,
      delay: next === 0 ? undefined : String(next),
    };
    if (!params.delay) delete params.delay;
    this.router.replaceWith('index', {
      queryParams: toEmberQueryParams(params),
    });
  };

  <template>
    <Range
      @id="{{@idPrefix}}-api-delay"
      @label="API delay"
      @value={{this.value}}
      @valueChange={{this.onValue}}
      @values={{this.values}}
    >
      <:readout>{{this.readout}}</:readout>
      <:hint>
        <span>Off</span>
        <span>3s</span>
      </:hint>
    </Range>
  </template>
}

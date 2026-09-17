import Component from '@glimmer/component';
import { cn } from '../../lib/utils';
import { StarIcon } from './icons';

export default class StarRating extends Component {
  get rounded() {
    return Math.round(this.args.rating * 2) / 2;
  }

  get stars() {
    return [0, 1, 2, 3, 4].map((index) => ({
      active: index + 1 <= this.rounded || index + 0.5 === this.rounded,
      index,
    }));
  }

  get label() {
    return `Rated ${this.args.rating.toFixed(1)} out of 5`;
  }

  <template>
    {{! template-lint-disable require-presentational-children }}
    <span
      aria-label={{this.label}}
      class={{cn "inline-flex items-center gap-0.5" @class}}
      role="img"
    >
      {{#each this.stars as |star|}}
        <StarIcon
          @class={{if
            star.active
            "text-warning fill-current"
            "text-divider dark:text-divider-dark fill-current"
          }}
        />
      {{/each}}
    </span>
  </template>
}

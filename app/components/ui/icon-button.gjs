import Component from '@glimmer/component';
import { cn } from '../../lib/utils';

const sizes = {
  default: 'size-8',
  sm: 'size-7',
};

export default class IconButton extends Component {
  get className() {
    return cn(
      'text-muted hover:bg-card focus-visible:ring-accent/40 dark:hover:bg-card-dark inline-flex shrink-0 items-center justify-center rounded-md transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white',
      sizes[this.args.size ?? 'default'],
      this.args.class,
    );
  }

  <template>
    <button
      aria-label={{@label}}
      class={{this.className}}
      type="button"
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

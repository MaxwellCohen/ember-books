import Component from '@glimmer/component';
import { cn } from '../../lib/utils';
import { SpinnerIcon } from './icons';

const sizes = {
  default: 'h-9 px-4 text-sm',
  icon: 'size-9',
  sm: 'h-8 px-3 text-xs',
};

const variants = {
  ghost:
    'text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white',
  primary: 'bg-action text-white hover:bg-action-hover',
  secondary:
    'border-divider hover:border-gray/40 hover:bg-card dark:border-divider-dark dark:hover:border-gray/30 dark:hover:bg-card-dark border bg-white text-black dark:bg-transparent dark:text-white',
};

export default class Button extends Component {
  get className() {
    return cn(
      'focus-visible:ring-action/40 inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      sizes[this.args.size ?? 'default'],
      variants[this.args.variant ?? 'primary'],
      this.args.class,
    );
  }

  get type() {
    return this.args.type ?? 'button';
  }

  <template>
    <button
      aria-label={{@label}}
      class={{this.className}}
      disabled={{@disabled}}
      type={{this.type}}
      ...attributes
    >
      {{#if @pending}}
        <SpinnerIcon />
      {{/if}}
      {{yield}}
    </button>
  </template>
}

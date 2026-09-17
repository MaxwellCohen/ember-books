import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { cn } from '../../lib/utils';

export default class Range extends Component {
  get selectedIndex() {
    const { value, values } = this.args;
    return values.reduce(
      (closest, option, index) =>
        Math.abs(option - value) < Math.abs(values[closest] - value)
          ? index
          : closest,
      0,
    );
  }

  onInput = (event) => {
    const next = this.args.values[Number(event.currentTarget.value)];
    this.args.valueChange?.(next);
  };

  <template>
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline justify-between gap-2">
        <label
          class="text-muted text-xs font-semibold tracking-wide uppercase"
          for={{@id}}
        >
          {{@label}}
        </label>
        <span
          class="text-sm font-medium text-black tabular-nums dark:text-white"
        >
          {{#if (has-block "readout")}}
            {{yield to="readout"}}
          {{else}}
            {{@value}}
          {{/if}}
        </span>
      </div>
      <input
        class={{cn
          "focus-visible:ring-accent/30 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
          @class
        }}
        id={{@id}}
        max={{this.maxIndex}}
        min="0"
        step="1"
        type="range"
        value={{this.selectedIndex}}
        {{on "input" this.onInput}}
      />
      {{#if (has-block "hint")}}
        <div class="text-muted flex justify-between text-[11px] tabular-nums">
          {{yield to="hint"}}
        </div>
      {{/if}}
    </div>
  </template>

  get maxIndex() {
    return this.args.values.length - 1;
  }
}

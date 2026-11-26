import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

// Feature test reactivity: @tracked autotracking. `markRender` runs once when
// the template is first rendered; it consumes no tracked state, so Glimmer
// never re-runs it. Clicking only updates the bound {{this.count}} text node.
export default class RenderCounter extends Component {
  @tracked count = 0;
  renders = 0;

  increment = () => {
    this.count++;
  };

  markRender = () => {
    this.renders++;
    if (typeof window !== 'undefined') window.__ftRenderCount = this.renders;
    return this.renders;
  };

  <template>
    <div data-testid="render-counter" class="space-y-2">
      <p>Count: <span data-testid="count">{{this.count}}</span></p>
      <p>Template renders:
        <span data-testid="renders">{{(this.markRender)}}</span></p>
      <button
        type="button"
        data-testid="increment"
        class="rounded-md border px-3 py-1"
        {{on "click" this.increment}}
      >Increment</button>
    </div>
  </template>
}

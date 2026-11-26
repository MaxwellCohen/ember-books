import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class FavoriteButton extends Component {
  @tracked saved = false;
  toggle = () => (this.saved = !this.saved);

  <template>
    <button
      type="button"
      data-testid="island-button"
      class="rounded-md border px-3 py-1"
      {{on "click" this.toggle}}
    >{{if this.saved "Saved" "Save"}} {{@title}}</button>
  </template>
}

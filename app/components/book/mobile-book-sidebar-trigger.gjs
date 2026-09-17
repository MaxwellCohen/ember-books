import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import Button from '../ui/button';
import { SlidersHorizontalIcon } from '../ui/icons';

export default class MobileBookSidebarTrigger extends Component {
  @service sidebar;

  <template>
    <Button
      @class="md:hidden"
      @label="Open filters"
      @size="icon"
      @variant="ghost"
      {{on "click" this.sidebar.open}}
    >
      <SlidersHorizontalIcon />
    </Button>
  </template>
}

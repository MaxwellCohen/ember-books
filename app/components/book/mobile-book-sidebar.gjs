import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import BookSidebar from './book-sidebar';
import { XIcon } from '../ui/icons';

export default class MobileBookSidebar extends Component {
  @service sidebar;

  closeOnLink = (event) => {
    if (event.target.closest('a[href]')) this.sidebar.close();
  };

  <template>
    {{yield}}

    {{#if this.sidebar.isOpen}}
      {{! template-lint-disable no-invalid-interactive }}
      <div
        aria-hidden="true"
        class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden"
        role="presentation"
        {{on "click" this.sidebar.close}}
      ></div>
      <aside
        aria-label="Book filters"
        class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-3rem))] max-w-full touch-pan-y flex-col overflow-x-hidden border-r pt-[max(1rem,env(safe-area-inset-top))] pr-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] shadow-2xl md:hidden"
        {{on "click" this.closeOnLink}}
      >
        <button
          aria-label="Close filters"
          class="text-muted hover:bg-card focus-visible:ring-accent dark:hover:bg-card-dark absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-md hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white"
          type="button"
          {{on "click" this.sidebar.close}}
        >
          <XIcon @class="size-5" />
        </button>
        <BookSidebar @idPrefix="mobile" @mobile={{true}} />
      </aside>
    {{/if}}
  </template>
}

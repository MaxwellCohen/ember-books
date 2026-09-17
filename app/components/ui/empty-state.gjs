import BookMark from './book-mark';

const EmptyState = <template>
  <div class="grid flex-1 place-items-center px-6 py-20 text-center">
    <div class="flex max-w-sm flex-col items-center gap-3">
      <BookMark @animated={{true}} @class="mb-1 size-10" />
      <p class="text-sm font-medium">{{@title}}</p>
      {{#if @body}}
        <p class="text-muted text-sm leading-6">{{@body}}</p>
      {{/if}}
      {{yield}}
    </div>
  </div>
</template>;

export default EmptyState;

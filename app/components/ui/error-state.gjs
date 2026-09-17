import { AlertTriangleIcon } from './icons';

const ErrorState = <template>
  {{#if @compact}}
    <div class="flex flex-col items-center gap-2 px-4 py-6 text-center">
      <AlertTriangleIcon @class="text-danger size-4" />
      <p class="text-muted text-xs">{{if
          @title
          @title
          "Something went wrong"
        }}</p>
      {{#if @body}}
        <p class="text-muted text-xs leading-5">{{@body}}</p>
      {{/if}}
      {{yield}}
    </div>
  {{else}}
    <div class="grid flex-1 place-items-center px-6 py-20 text-center">
      <div class="flex max-w-sm flex-col items-center gap-3">
        <AlertTriangleIcon @class="text-danger size-6" />
        <p class="text-sm font-medium text-black dark:text-white">{{if
            @title
            @title
            "Something went wrong"
          }}</p>
        {{#if @body}}
          <p class="text-muted text-sm leading-6">{{@body}}</p>
        {{/if}}
        {{yield}}
      </div>
    </div>
  {{/if}}
</template>;

export default ErrorState;

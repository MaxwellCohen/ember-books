import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
} from '../../lib/book/book-constants';
import { cn } from '../../lib/utils';
import Skeleton from '../ui/skeleton';

export default class BookCover extends Component {
  @tracked failedSrc = null;

  get resolved() {
    return getLargeBookImageUrl(this.args.src ?? EMPTY_IMAGE_URL);
  }

  get unavailable() {
    return this.failedSrc === this.resolved;
  }

  get loading() {
    return this.args.priority ? 'eager' : 'lazy';
  }

  onError = () => {
    this.failedSrc = this.resolved;
  };

  <template>
    <div
      class={{cn
        "bg-card dark:bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md"
        @class
      }}
    >
      {{#if this.unavailable}}
        <div
          aria-label="Cover unavailable for {{@title}}"
          class="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
          role="img"
        >
          Cover unavailable
        </div>
      {{else}}
        <img
          alt={{@title}}
          class="absolute inset-0 size-full object-cover"
          loading={{this.loading}}
          src={{this.resolved}}
          {{on "error" this.onError}}
        />
      {{/if}}
    </div>
  </template>
}

const BookCoverSkeleton = <template>
  <Skeleton
    @class={{cn "skeleton-subtle aspect-[2/3] w-full rounded-md" @class}}
  />
</template>;

export { BookCoverSkeleton };

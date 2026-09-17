import { cn } from '../../lib/utils';

const Skeleton = <template>
  <span
    aria-hidden="true"
    class={{cn "skeleton-animation block" @class}}
  ></span>
</template>;

export default Skeleton;

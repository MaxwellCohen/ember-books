import { cn } from '../../lib/utils';
import { SpinnerIcon } from './icons';

const Spinner = <template>
  <SpinnerIcon @class={{cn "size-4 shrink-0" @class}} />
</template>;

export default Spinner;

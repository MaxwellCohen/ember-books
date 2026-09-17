import { cn } from '../../lib/utils';

const SearchIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3-3" />
  </svg>
</template>;

const XIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
</template>;

const ChevronLeftIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
</template>;

const ChevronRightIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
</template>;

const ChevronDownIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
</template>;

const SlidersHorizontalIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M10 5H3" />
    <path d="M21 5h-7" />
    <path d="M14 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
    <path d="M4 12H3" />
    <path d="M21 12H8" />
    <path d="M8 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
    <path d="M12 19H3" />
    <path d="M21 19h-5" />
    <path d="M16 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
  </svg>
</template>;

const SunIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
</template>;

const MoonIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 14.3A9 9 0 1 1 9.7 3a7 7 0 0 0 11.3 11.3Z" />
  </svg>
</template>;

const MonitorIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <rect height="14" rx="2" width="20" x="2" y="3" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
</template>;

const StarIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="currentColor"
    stroke="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 2.5 14.9 8.7l6.8.6-5.2 4.6 1.6 6.6L12 17.3 5.9 20.5l1.6-6.6-5.2-4.6 6.8-.6z"
    />
  </svg>
</template>;

const ArrowLeftIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
</template>;

const BookOpenIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 7c-1.8-1.4-4-2-6.5-2H3v14h2.5c2.5 0 4.7.6 6.5 2" />
    <path d="M12 7c1.8-1.4 4-2 6.5-2H21v14h-2.5c-2.5 0-4.7.6-6.5 2" />
  </svg>
</template>;

const GlobeIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20" />
    <path d="M12 2a15 15 0 0 0 0 20" />
  </svg>
</template>;

const CalendarDaysIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <rect height="18" rx="2" width="18" x="3" y="4" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
</template>;

const Building2Icon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
</template>;

const HashIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3 8 21" />
    <path d="m16 3-2 18" />
  </svg>
</template>;

const AlertTriangleIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4" @class}}
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path
      d="m10.3 3.9-8.1 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.8-3.1l-8.1-14a2 2 0 0 0-3.4 0Z"
    />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
</template>;

const SpinnerIcon = <template>
  <svg
    aria-hidden="true"
    class={{cn "size-4 animate-spin" @class}}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="3"
    />
    <path
      class="opacity-90"
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="3"
    />
  </svg>
</template>;

export {
  AlertTriangleIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  Building2Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  HashIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SpinnerIcon,
  StarIcon,
  SunIcon,
  XIcon,
};

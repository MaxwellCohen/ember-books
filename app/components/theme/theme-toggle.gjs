import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { cn } from '../../lib/utils';
import { MonitorIcon, MoonIcon, SunIcon } from '../ui/icons';

export default class ThemeToggle extends Component {
  @service theme;

  get isInline() {
    return this.args.variant === 'inline';
  }

  <template>
    <div
      class={{if
        this.isInline
        "inline-flex items-center gap-0.5"
        "border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5"
      }}
    >
      <ToggleButton
        @active={{this.isLight}}
        @label="Light mode"
        @setTheme={{this.theme.setTheme}}
        @value="light"
      >
        <SunIcon />
      </ToggleButton>
      <ToggleButton
        @active={{this.isDark}}
        @label="Dark mode"
        @setTheme={{this.theme.setTheme}}
        @value="dark"
      >
        <MoonIcon />
      </ToggleButton>
      <ToggleButton
        @active={{this.isSystem}}
        @label="System theme"
        @setTheme={{this.theme.setTheme}}
        @value="system"
      >
        <MonitorIcon />
      </ToggleButton>
    </div>
  </template>

  get isLight() {
    return this.theme.theme === 'light';
  }

  get isDark() {
    return this.theme.theme === 'dark';
  }

  get isSystem() {
    return this.theme.theme === 'system';
  }
}

class ToggleButton extends Component {
  get className() {
    return cn(
      'rounded-full p-1.5 transition-colors',
      this.args.active
        ? 'bg-card dark:bg-card-dark text-black dark:text-white'
        : 'text-muted hover:text-black dark:hover:text-white',
    );
  }

  select = () => {
    this.args.setTheme(this.args.value);
  };

  <template>
    <button
      aria-label={{@label}}
      aria-pressed={{@active}}
      class={{this.className}}
      type="button"
      {{on "click" this.select}}
    >
      {{yield}}
    </button>
  </template>
}

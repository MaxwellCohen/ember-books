import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  applyThemeClass,
  readStoredTheme,
  THEME_STORAGE_KEY,
} from '../lib/theme';

export default class ThemeService extends Service {
  @tracked theme = 'system';
  #media;

  constructor() {
    super(...arguments);

    if (typeof window === 'undefined') return;

    this.theme = readStoredTheme();
    applyThemeClass(this.theme);

    this.#media = window.matchMedia('(prefers-color-scheme: dark)');
    this.#media.addEventListener('change', this.#onSystemChange);
  }

  willDestroy() {
    super.willDestroy();
    this.#media?.removeEventListener('change', this.#onSystemChange);
  }

  setTheme = (theme) => {
    this.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeClass(theme);
  };

  #onSystemChange = () => {
    applyThemeClass(this.theme);
  };
}

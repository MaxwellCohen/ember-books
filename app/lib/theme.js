export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value) {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function themeIsDark(theme, systemDark) {
  return theme === 'dark' || (theme === 'system' && systemDark);
}

export function applyThemeClass(theme) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle(
    'dark',
    themeIsDark(theme, systemDark),
  );
}

export function readStoredTheme() {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : 'system';
}

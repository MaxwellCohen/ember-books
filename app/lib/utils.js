import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function delay(ms, enabled = true) {
  return enabled
    ? new Promise((resolve) => setTimeout(resolve, ms))
    : Promise.resolve();
}

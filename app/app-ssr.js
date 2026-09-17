import App from './app';
import config from './config/environment';

export { settled } from '@ember/test-helpers';

export function createSsrApp() {
  return App.create({ ...config.APP, autoboot: false });
}

import { bootRehydrated, installShoebox } from 'vite-ember-ssr/client';
import App from './app';
import config from './config/environment';

installShoebox();
bootRehydrated(App, config);

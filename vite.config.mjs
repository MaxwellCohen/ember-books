import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { emberSsr } from 'vite-ember-ssr/vite-plugin';
import { setupPlugins as responsiveImage } from '@responsive-image/vite-plugin';

export default defineConfig(({ isSsrBuild, mode }) => ({
  appType: 'custom',
  server: {
    port: 4200,
  },
  build: isSsrBuild
    ? {}
    : {
        // Feature tests: a second client entry for the hand-rolled islands page
        // (/feature-tests/islands). The manifest lets the build script find it.
        manifest: true,
        rolldownOptions: {
          input: {
            main: 'index.html',
            islands: 'app/islands.js',
            // @embroider/vite only adds the tests page when it owns `input`.
            ...(mode !== 'production' && { tests: 'tests/index.html' }),
          },
        },
      },
  plugins: [
    tailwindcss(),
    // Feature tests: community image pipeline (srcset + AVIF/WebP at build time).
    responsiveImage({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
      w: [640, 1080, 1920],
      format: ['avif', 'webp', 'original'],
    }),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    emberSsr(),
  ],
}));

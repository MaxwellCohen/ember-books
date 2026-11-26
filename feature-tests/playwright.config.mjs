import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.FT_PORT || 4117);

export default defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.ts$/,
  outputDir: './.out/test-results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: {
      executablePath:
        process.env.CHROME_PATH || '/home/maxc/.local/bin/google-chrome',
    },
  },
  projects: [
    // Build-time features: run before the production server is started,
    // because they run their own builds into dist/.
    {
      name: 'build',
      testMatch: /(bundle-analysis|multi-host-deployment)\.spec\.ts$/,
      timeout: 600_000,
    },
    {
      name: 'browser',
      testIgnore: /(bundle-analysis|multi-host-deployment)\.spec\.ts$/,
    },
  ],
});

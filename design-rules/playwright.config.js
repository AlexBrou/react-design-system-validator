import { defineConfig, devices } from '@playwright/test';

const PORT = 5199;

export default defineConfig({
  testDir: './rendered',
  outputDir: '../.design-report/results',
  reporter: [['list'], ['html', { outputFolder: '../.design-report/html', open: 'never' }]],
  fullyParallel: true,
  use: { baseURL: `http://localhost:${PORT}` },
  // One project per M3 window size class to check.
  projects: [
    { name: 'compact', use: { ...devices['Desktop Chrome'], viewport: { width: 412, height: 915 } } },
    { name: 'expanded', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    cwd: '..',
    port: PORT,
    reuseExistingServer: true,
  },
});

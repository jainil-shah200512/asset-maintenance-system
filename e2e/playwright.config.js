// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Asset Maintenance E2E tests
 */
export default defineConfig({
  testDir: './tests',

  // Keep tests parallel locally, but CI stays stable with 1 worker
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Better reports for debugging
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    // Default to deployed app, but allow override with BASE_URL
    baseURL:
      process.env.BASE_URL || 'https://asset-maintenance-system.vercel.app',

    // Helpful debugging settings
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Useful defaults
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Start with Chromium only for now
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

// @ts-check
require('dotenv').config({ path: '.env.local' });

const { defineConfig, devices } = require('@playwright/test');
const env = require('./config/env');

module.exports = defineConfig({
  testDir: './tests',

  // Global setup runs once before all tests — validates backend + credentials
  globalSetup: './setup/global-setup.js',

  // Run tests sequentially on localhost for easier debugging
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: env.baseUrl,

    // Capture artifacts on failure
    trace:      'retain-on-failure',
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',

    headless:           true,
    actionTimeout:      15_000,
    navigationTimeout:  30_000,
  },

  projects: [
    {
      name: 'localhost-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'test-results',
});

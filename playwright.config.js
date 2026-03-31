import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for XSLTDebugX
 * Tests a static site deployed on Cloudflare Pages
 */

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',

  /* Run tests in separate processes */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Enable retries on CI to handle transient timeouts */
  retries: process.env.CI ? 2 : 0,

  /* Test timeout - increased aggressively for slow CI environments */
  timeout: process.env.CI ? 120000 : 30000,

  /* Keep 4 workers on CI for speed (tests take ~7 min with parallelization) */
  workers: process.env.CI ? 4 : 2,

  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:8000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Additional browsers can be added later for broader coverage
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    /* Wait for server to be fully up before starting tests */
    ignoreHTTPSErrors: true,
  },

  /* Expect timeout (for assertions) */
  expect: {
    timeout: 10 * 1000
  }
});

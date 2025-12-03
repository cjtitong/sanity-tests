import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120000,
  retries: 0,
  workers: 3,
  use: {
    headless: true, // Headless in CI
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    baseURL: 'https://www.givesendgo.com',
  },

  reporter: [
    ['list'], 
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ["@testiny/automation/reporters/playwright", {
      enable: true,
      project: "GSGTM",
      token: "tny_6RjxPtqntQyXSveNy7mQO8RQMUJmN11bnF8D0Ih9YIUBBBAp",
      sourceName: "sanity-tests",
      enableAttachments: true,
      completeRuns: true
    }]
  ],
});

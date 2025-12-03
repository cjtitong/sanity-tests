import { test } from '../../fixtures/baseFixture.js';
import { expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';

test('Mobile responsive layout', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  const home = new HomePage(page);
  await home.goto();

  await expect(home.trendingSection.first()).toBeVisible({ timeout: 30000 });
});

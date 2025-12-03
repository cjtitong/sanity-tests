import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';

test('Homepage loads and all buttons redirect properly', async ({ page, context }) => {
  const home = new HomePage(page);
  await home.goto();

  await expect(home.aboutLink).toBeVisible({ timeout: 60000 });
  await expect(home.pricingLink).toBeVisible({ timeout: 60000 });
  await expect(home.signInLink).toBeVisible({ timeout: 60000 });
  await expect(home.helpCenterLink).toBeVisible({ timeout: 60000 });

  await home.clickAbout();
  await expect(page).toHaveURL(/about/);
  await home.goto();

  await home.clickPricing();
  await expect(page).toHaveURL(/pricing-and-fees/);
  await home.goto();

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    home.clickHelpCenter()
  ]);
  await newPage.waitForLoadState('load');
  await expect(newPage).toHaveURL(/help\.givesendgo\.com/);
  await newPage.close();

  await home.goto();
  await home.clickSignIn();
  await expect(page).toHaveURL('https://www.givesendgo.com/site/login');
});

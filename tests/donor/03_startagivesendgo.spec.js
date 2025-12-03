import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';

test('Start a GiveSendGo', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.clickStartAGiveSendGo();

  const signupForm = page.locator('#form-signup-first');
  await expect(signupForm).toBeVisible({ timeout: 15000 });
});

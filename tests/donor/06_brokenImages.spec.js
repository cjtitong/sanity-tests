import { test } from '../../fixtures/baseFixture.js';
import { expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';

test('No broken images on homepage', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  const brokenImages = await page.evaluate(() => {
    return Array.from(document.images)
      .filter(img => img.offsetParent !== null)
      .filter(img => 
        !img.src.startsWith('https://api.nivaai.com') &&
        !img.src.includes('analytics') &&
        !img.src.includes('pixel')
      )
      .map((img, idx) => ({
        index: idx,
        src: img.src,
        loaded: img.complete && img.naturalWidth > 20
      }))
      .filter(img => !img.loaded);
  });

  expect(brokenImages.length).toBe(0);
});

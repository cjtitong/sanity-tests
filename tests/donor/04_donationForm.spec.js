import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';
import CampaignPage from '../../pages/CampaignPage.js';
import { DonationPage } from '../../pages/DonationPage.js';

test('Donation form loads from a trending campaign', async ({ page }) => {
  const home = new HomePage(page);
  const campaign = new CampaignPage(page);
  const donation = new DonationPage(page);

  await home.goto();
  await home.trendingSection.first().waitFor({ state: 'visible', timeout: 30000 });

  const firstCard = home.trendingSlider.locator('.camp-card__wrapper').first();
  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.click();

  await campaign.campaignTitle.waitFor({ state: 'visible', timeout: 30000 });
  await campaign.openDonationForm();

  await expect(donation.form).toBeVisible();
});

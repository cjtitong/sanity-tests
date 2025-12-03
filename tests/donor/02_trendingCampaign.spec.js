import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';
import CampaignPage from '../../pages/CampaignPage.js';

test('User can open first trending campaign', async ({ page }) => {
  const home = new HomePage(page);
  const campaign = new CampaignPage(page);

  await home.goto();
  await home.trendingSection.first().waitFor({ state: 'visible', timeout: 45000 });

  await home.openFirstTrendingCampaign();

  await campaign.campaignTitle.waitFor({ state: 'visible', timeout: 30000 });
  await expect(campaign.campaignTitle.first()).toBeVisible();
});

export default class CampaignPage {
  constructor(page) {
    this.page = page;
    this.campaignTitle = page.locator('h1[data-test="campaign-title"]:visible');
  }

  async openDonationForm() {
    await this.campaignTitle.waitFor({ state: 'visible', timeout: 30000 });

    const giveButton = this.page.locator('button:has-text("Give"):visible').first();
    await giveButton.scrollIntoViewIfNeeded();
    await giveButton.waitFor({ state: 'visible', timeout: 30000 });
    await giveButton.click();
  }
}

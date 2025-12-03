export default class HomePage {
  constructor(page) {
    this.page = page;

    this.aboutLink = page.locator('header a', { hasText: 'About' }).first();
    this.pricingLink = page.locator('header a', { hasText: 'Pricing & Fees' }).first();
    this.helpCenterLink = page.locator('a', { hasText: 'Help Center' }).first();
    this.signInLink = page.locator('header a', { hasText: 'Sign In' }).first();
    this.startAGiveSendGoLink = page.locator('#start-camp-header').first();

    this.trendingSection = page.locator("section:has(h2:text('Trending'))");
    this.trendingSlider = page.locator('.trendSlider');
    this.trendingCards = this.trendingSlider.locator('.camp-card__wrapper');
  }

  async goto() {
    await this.page.goto('https://www.givesendgo.com', { waitUntil: 'load', timeout: 90000 });

    await Promise.race([
      this.trendingSection.first().waitFor({ state: 'visible', timeout: 60000 }),
      this.aboutLink.waitFor({ state: 'visible', timeout: 60000 }).catch(() => null)
    ]);
  }

  async safeClick(locator, timeout = 30000) {
    const visible = await locator.isVisible({ timeout }).catch(() => false);
    if (visible) {
      await locator.scrollIntoViewIfNeeded();
      await locator.click();
    }
  }

  async clickAbout() { await this.safeClick(this.aboutLink); }
  async clickPricing() { await this.safeClick(this.pricingLink); }
  async clickHelpCenter() { await this.safeClick(this.helpCenterLink); }
  async clickSignIn() { await this.safeClick(this.signInLink); }
  async clickStartAGiveSendGo() { await this.safeClick(this.startAGiveSendGoLink); }

  async openFirstTrendingCampaign() {
    await this.trendingSection.first().waitFor({ state: 'visible', timeout: 45000 });
    await this.trendingSlider.waitFor({ state: 'visible', timeout: 45000 });

    const firstCard = this.trendingCards.first();
    await firstCard.waitFor({ state: 'visible', timeout: 45000 });
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();
  }
}

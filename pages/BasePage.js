export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url = '/') {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async click(locator) {
    await locator.click();
  }

  async isVisible(locator) {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    return locator.isVisible();
  }

  async getText(locator) {
    return locator.textContent();
  }
}

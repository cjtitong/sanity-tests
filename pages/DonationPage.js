export class DonationPage {
  constructor(page) {
    this.page = page;
    this.form = page.locator('form#donationForm, form');
  }

  isVisible() {
    return this.form.isVisible();
  }
}

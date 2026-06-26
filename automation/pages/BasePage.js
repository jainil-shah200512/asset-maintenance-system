/**
 * pages/BasePage.js
 *
 * Base class for all page objects.
 * Contains shared navigation, wait, and assertion helpers.
 */
const { expect } = require('@playwright/test');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** Wait until no network requests are in-flight */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /** Assert the current URL matches a string or regex */
  async expectUrl(pattern) {
    await expect(this.page).toHaveURL(pattern);
  }

  /** Assert a hot-toast message is visible */
  async expectToast(textPattern) {
    // react-hot-toast renders inside a div with role="status"
    const toast = this.page.locator('[role="status"]').filter({ hasText: textPattern });
    await expect(toast).toBeVisible({ timeout: 5_000 });
  }
}

module.exports = { BasePage };

const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  async expectLoaded() {
    // Main success check: URL changes away from login page
    await expect(this.page).toHaveURL(/manager|dashboard|technician|user|admin/i);

    // Secondary UI check: one of these common dashboard texts should exist
    await expect(
      this.page.getByText(/dashboard|assets|tasks|manager|welcome/i).first()
    ).toBeVisible();
  }
}

module.exports = { DashboardPage };
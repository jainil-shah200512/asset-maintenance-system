/**
 * pages/TaskDetailPage.js
 *
 * Covers the task detail view at '/tasks/:id'.
 * Shows task info, action panel, material requests, and activity log.
 */
const { expect }   = require('@playwright/test');
const { BasePage } = require('./BasePage');

class TaskDetailPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading          = page.getByRole('heading', { name: /task details/i });
    this.backButton       = page.getByRole('button',  { name: /back to tasks/i });
    this.errorBanner      = page.locator('.bg-red-50').first();
    this.loadingText      = page.getByText(/loading/i);

    // Task info badges — rounded-full pills
    this.statusBadge      = page.locator('[class*="rounded-full"]').first();

    // Activity log section
    this.activitySection  = page.getByText(/activity log/i).first();
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.page).toHaveURL(/\/tasks\/\d+/);
    await expect(this.loadingText).not.toBeVisible();
  }

  async expectStatusBadgeVisible() {
    await expect(this.statusBadge).toBeVisible();
  }

  async goBack() {
    await this.backButton.click();
    await expect(this.page).toHaveURL('/tasks');
  }
}

module.exports = { TaskDetailPage };

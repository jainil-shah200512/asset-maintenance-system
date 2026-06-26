/**
 * pages/TasksPage.js
 *
 * Covers the task list page at '/tasks'.
 * Available to MANAGER, TECHNICIAN, USER.
 */
const { expect }   = require('@playwright/test');
const { BasePage } = require('./BasePage');

class TasksPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading          = page.getByRole('heading', { name: /^tasks$/i });
    this.createButton     = page.getByRole('button',  { name: /\+ create task/i });

    // View toggles
    this.activeViewBtn    = page.getByRole('button', { name: /^active$/i });
    this.archivedViewBtn  = page.getByRole('button', { name: /^archived$/i });

    // Filters
    this.keywordInput     = page.getByRole('textbox', { name: /search/i });
    this.searchButton     = page.getByRole('button',  { name: /^search$/i });
    this.clearButton      = page.getByRole('button',  { name: /^clear$/i });

    // Content
    // TaskCard shares the same white rounded card pattern
    this.taskCards        = page.locator('.rounded-2xl.bg-white.p-5.shadow');
    this.emptyMessage     = page.getByText(/no tasks found/i);
    this.loadingText      = page.getByText(/loading tasks/i);
    this.errorBanner      = page.locator('.bg-red-50').first();
  }

  async goto() {
    await this.page.goto('/tasks');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.loadingText).not.toBeVisible();
  }

  async getTaskCount() {
    await this.page.waitForLoadState('networkidle');
    return this.taskCards.count();
  }

  async switchToArchivedView() {
    await this.archivedViewBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async switchToActiveView() {
    await this.activeViewBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByKeyword(keyword) {
    await this.keywordInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters() {
    await this.clearButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Click a task card by index (0-based) and wait for the detail URL */
  async openTaskAtIndex(index = 0) {
    await this.taskCards.nth(index).click();
    await expect(this.page).toHaveURL(/\/tasks\/\d+/);
  }

  async clickCreateTask() {
    await this.createButton.click();
    await expect(this.page).toHaveURL('/tasks/new');
  }
}

module.exports = { TasksPage };

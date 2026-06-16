const { expect } = require('@playwright/test');

class TasksPage {
  constructor(page) {
    this.page = page;

    // Exact/safe locators based on your Codegen output
    this.tasksNavButton = page.getByRole('button', { name: 'Tasks', exact: true });
    this.tasksHeading = page.getByRole('heading', { name: 'Tasks' });
    this.tasksDescription = page.getByText('Search, manage, and monitor');

    this.searchInput = page.getByRole('textbox', { name: 'Search by code or title' });
    this.prioritySelect = page.locator('select[name="priority"]');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.clearButton = page.getByRole('button', { name: 'Clear' });

    this.archivedTasksButton = page.getByRole('button', { name: 'Archived Tasks' });
    this.activeTasksButton = page.getByRole('button', { name: 'Active Tasks' });

    this.viewDetailsButtons = page.getByRole('button', { name: 'View Details' });
    this.backToTasksButton = page.getByRole('button', { name: 'Back to Tasks' });
  }

  async openFromManagerHome() {
    await this.tasksNavButton.click();
  }

  async expectLoaded() {
    await expect(this.tasksHeading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
  }

  async expectSummaryVisible() {
    await expect(this.tasksDescription).toBeVisible();
  }

  async searchByText(searchText) {
    await this.searchInput.fill(searchText);
    await this.searchButton.click();
  }

  async filterByPriority(priorityValue) {
    await this.prioritySelect.selectOption(priorityValue);
    await this.searchButton.click();
  }

  async clearFilters() {
    await this.clearButton.click();
  }

  async showArchivedTasks() {
    await this.archivedTasksButton.click();
  }

  async showActiveTasks() {
    await this.activeTasksButton.click();
  }

  async openFirstTaskDetails() {
    await this.viewDetailsButtons.first().click();
  }

  async expectTaskDetailsLoaded() {
    await expect(this.backToTasksButton).toBeVisible({ timeout: 15000 });
  }

  async goBackToTasks() {
    // Retry because this button seems to re-render/detach occasionally
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const backButton = this.page.getByRole('button', { name: 'Back to Tasks' });

        await expect(backButton).toBeVisible({ timeout: 15000 });
        await expect(backButton).toBeEnabled({ timeout: 15000 });

        await backButton.click({ timeout: 15000 });

        // Confirm we are back on the Tasks page
        await expect(this.tasksHeading).toBeVisible({ timeout: 15000 });
        return;
      } catch (error) {
        if (attempt === 3) {
          throw error;
        }
      }
    }
  }
}

module.exports = { TasksPage };
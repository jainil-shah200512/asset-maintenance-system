const { expect } = require('@playwright/test');

class ManagerPage {
  constructor(page) {
    this.page = page;

    // Exact/safe locators based on your Codegen output
    this.dashboardButton = page.getByRole('button', { name: 'Dashboard' });
    this.tasksButton = page.getByRole('button', { name: 'Tasks', exact: true });
    this.assetsButton = page.getByRole('button', { name: 'Assets' });
    this.staffButton = page.getByRole('button', { name: 'Staff' });
    this.reportedButton = page.getByRole('button', { name: 'Reported' });
    this.totalTasksButton = page.getByRole('button', { name: 'Total Tasks' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.managerUserText = page.getByText('Manager User');
  }

  async expectShellVisible() {
    await expect(this.dashboardButton).toBeVisible({ timeout: 20000 });
    await expect(this.tasksButton).toBeVisible({ timeout: 20000 });
    await expect(this.assetsButton).toBeVisible({ timeout: 20000 });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/manager/i, { timeout: 20000 });
    await this.expectShellVisible();
  }

  async openDashboard() {
    await this.dashboardButton.click();
  }

  async openTasks() {
    await this.tasksButton.click();
  }

  async openAssets() {
    await this.assetsButton.click();
  }

  async openStaff() {
    await this.staffButton.click();
  }

  async openReported() {
    await this.reportedButton.click();
  }

  async openTotalTasks() {
    await this.totalTasksButton.click();
  }

  async expectManagerIdentityVisible() {
    await expect(this.managerUserText).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { ManagerPage };
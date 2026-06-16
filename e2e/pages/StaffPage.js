const { expect } = require('@playwright/test');

class StaffPage {
  constructor(page) {
    this.page = page;

    // Exact/safe locators based on your Codegen output
    this.staffNavButton = page.getByRole('button', { name: 'Staff' });
    this.staffManagementHeading = page.getByRole('heading', { name: 'Staff Management' });

    this.staffDescription = page.getByText('Create technician accounts');

    this.createTechnicianHeading = page.getByRole('heading', { name: 'Create Technician' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');

    this.promoteHeading = page.getByRole('heading', { name: 'Promote User → Technician' });
    this.promoteButton = page.getByRole('button', { name: 'Promote to Technician' }).first();
  }

  async openFromManagerHome() {
    await this.staffNavButton.click();
  }

  async expectLoaded() {
    await expect(this.staffManagementHeading).toBeVisible();
    await expect(this.createTechnicianHeading).toBeVisible();
    await expect(this.promoteHeading).toBeVisible();
  }

  async expectSummaryVisible() {
    await expect(this.staffDescription).toBeVisible();
  }

  async expectCreateTechnicianFormVisible() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async expectPromoteSectionVisible() {
    await expect(this.promoteHeading).toBeVisible();
    await expect(this.promoteButton).toBeVisible();
  }
}

module.exports = { StaffPage };
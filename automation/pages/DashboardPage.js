/**
 * pages/DashboardPage.js
 *
 * Covers the three role-specific dashboards and the shared Navbar.
 * Routes:  /manager | /technician | /user | /admin
 */
const { expect }   = require('@playwright/test');
const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // ── Navbar ────────────────────────────────────────────────
    this.dashboardButton = page.getByRole('button', { name: /^dashboard$/i });
    this.tasksButton     = page.getByRole('button', { name: /^tasks$/i });
    this.assetsButton    = page.getByRole('button', { name: /^assets$/i });
    this.staffButton     = page.getByRole('button', { name: /^staff$/i });
    this.logoutButton    = page.getByRole('button', { name: /^logout$/i });
  }

  // ── Manager Dashboard ────────────────────────────────────────

  async expectManagerDashboardLoaded() {
    await expect(this.page).toHaveURL('/manager');
    await expect(
      this.page.getByRole('heading', { name: /manager dashboard/i })
    ).toBeVisible();
  }

  async expectManagerMetricsVisible() {
    await expect(this.page.getByText(/reported/i).first()).toBeVisible();
    await expect(this.page.getByText(/total tasks/i)).toBeVisible();
  }

  // ── Technician Dashboard ─────────────────────────────────────

  async expectTechnicianDashboardLoaded() {
    await expect(this.page).toHaveURL('/technician');
    await expect(
      this.page.getByRole('heading', { name: /technician dashboard/i })
    ).toBeVisible();
  }

  // ── User Dashboard ───────────────────────────────────────────

  async expectUserDashboardLoaded() {
    await expect(this.page).toHaveURL('/user');
    await expect(
      this.page.getByRole('heading', { name: /user dashboard/i })
    ).toBeVisible();
  }

  // ── Navigation helpers ────────────────────────────────────────

  async navigateToAssets() {
    await this.assetsButton.click();
    await expect(this.page).toHaveURL('/assets');
  }

  async navigateToTasks() {
    await this.tasksButton.click();
    await expect(this.page).toHaveURL('/tasks');
  }

  async navigateToStaff() {
    await this.staffButton.click();
    await expect(this.page).toHaveURL('/staff');
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL('/');
  }
}

module.exports = { DashboardPage };

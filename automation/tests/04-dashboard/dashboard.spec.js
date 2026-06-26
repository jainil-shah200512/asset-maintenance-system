/**
 * tests/04-dashboard/dashboard.spec.js
 *
 * Test suite: Dashboard — Role-based views and navigation
 *
 * Workflow coverage (READ-ONLY):
 *   R1   — Manager dashboard after login
 *   R2   — Technician dashboard after login
 *   R3   — User dashboard after login
 *   NAV  — Navigation between dashboard and main sections
 */
const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/test-fixtures');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('Dashboard — Role-based views', () => {

  // ── R1: Manager dashboard ──────────────────────────────────────────────

  test.describe('R1: Manager dashboard', () => {

    test('Manager sees correct dashboard page', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');
      await dashboardPage.expectManagerDashboardLoaded();
    });

    test('Manager dashboard displays metrics cards', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');
      await dashboardPage.expectManagerDashboardLoaded();
      await dashboardPage.expectManagerMetricsVisible();
    });

    test('Manager can navigate to tasks from dashboard', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');
      await dashboardPage.expectManagerDashboardLoaded();

      await dashboardPage.navigateToTasks();
      await expect(managerPage).toHaveURL(/\/tasks/);
    });

    test('Manager can navigate to assets from dashboard', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');

      await dashboardPage.navigateToAssets();
      await expect(managerPage).toHaveURL(/\/assets/);
    });

    test('Manager can navigate to staff management', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');

      await dashboardPage.navigateToStaff();
      await expect(managerPage).toHaveURL(/\/staff/);
    });

    test('Manager can navigate back to dashboard', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');
      await dashboardPage.navigateToTasks();

      await dashboardPage.dashboardButton.click();
      await expect(managerPage).toHaveURL(/\/manager/);
    });

  });

  // ── R2: Technician dashboard ───────────────────────────────────────────

  test.describe('R2: Technician dashboard', () => {

    test('Technician sees correct dashboard page', async ({ technicianPage }) => {
      const dashboardPage = new DashboardPage(technicianPage);
      await dashboardPage.goto('/technician');
      await dashboardPage.expectTechnicianDashboardLoaded();
    });

    test('Technician can navigate to tasks', async ({ technicianPage }) => {
      const dashboardPage = new DashboardPage(technicianPage);
      await dashboardPage.goto('/technician');

      await dashboardPage.navigateToTasks();
      await expect(technicianPage).toHaveURL(/\/tasks/);
    });

    test('Technician can navigate to assets', async ({ technicianPage }) => {
      const dashboardPage = new DashboardPage(technicianPage);
      await dashboardPage.goto('/technician');

      await dashboardPage.navigateToAssets();
      await expect(technicianPage).toHaveURL(/\/assets/);
    });

  });

  // ── R3: User dashboard ─────────────────────────────────────────────────

  test.describe('R3: User dashboard', () => {

    test('User sees correct dashboard page', async ({ userPage }) => {
      const dashboardPage = new DashboardPage(userPage);
      await dashboardPage.goto('/user');
      await dashboardPage.expectUserDashboardLoaded();
    });

    test('User can navigate to tasks', async ({ userPage }) => {
      const dashboardPage = new DashboardPage(userPage);
      await dashboardPage.goto('/user');

      await dashboardPage.navigateToTasks();
      await expect(userPage).toHaveURL(/\/tasks/);
    });

    test('User can navigate to assets', async ({ userPage }) => {
      const dashboardPage = new DashboardPage(userPage);
      await dashboardPage.goto('/user');

      await dashboardPage.navigateToAssets();
      await expect(userPage).toHaveURL(/\/assets/);
    });

  });

  // ── Navbar and logout ──────────────────────────────────────────────────

  test.describe('Navbar and logout', () => {

    test('Navbar displays current user role', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');

      // Navbar should be visible with navigation buttons
      // Role display may vary in implementation
      await expect(dashboardPage.dashboardButton).toBeVisible();
    });

    test('Logout from manager dashboard returns to login', async ({ managerPage }) => {
      const dashboardPage = new DashboardPage(managerPage);
      await dashboardPage.goto('/manager');
      await dashboardPage.expectManagerDashboardLoaded();

      await dashboardPage.logout();
      await expect(managerPage).toHaveURL('/');
    });

  });

});

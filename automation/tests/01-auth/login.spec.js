/**
 * tests/01-auth/login.spec.js
 *
 * Test suite: Authentication — Login
 *
 * Workflow coverage (READ-ONLY):
 *   R1  — Manager login → redirected to /manager
 *   R2  — Technician login → redirected to /technician
 *   R3  — User login → redirected to /user
 *   NEG — Invalid credentials → error shown, stays on login page
 *   NEG — HTML5 required validation (empty fields)
 */
const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { USERS, INVALID_CREDENTIALS } = require('../../fixtures/test-data');

test.describe('Authentication — Login', () => {

  /** @type {LoginPage} */    let loginPage;
  /** @type {DashboardPage} */ let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();
  });

  // ── Valid login — role-based redirect ────────────────────────

  test.describe('Valid credentials — role redirect', () => {

    test('R1: Manager login redirects to /manager', async ({ page }) => {
      await loginPage.login(USERS.manager.email, USERS.manager.password);
      await dashboardPage.expectManagerDashboardLoaded();
    });

    test('R2: Technician login redirects to /technician', async ({ page }) => {
      await loginPage.login(USERS.technician.email, USERS.technician.password);
      await dashboardPage.expectTechnicianDashboardLoaded();
    });

    test('R3: User login redirects to /user', async ({ page }) => {
      await loginPage.login(USERS.user.email, USERS.user.password);
      await dashboardPage.expectUserDashboardLoaded();
    });

  });

  // ── Invalid credentials ──────────────────────────────────────

  test.describe('Invalid credentials', () => {

    test('Wrong email + password → error banner shown', async ({ page }) => {
      await loginPage.login(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password);
      await loginPage.expectErrorVisible();
      await loginPage.expectStillOnLoginPage();
    });

    test('Correct email, wrong password → error banner shown', async ({ page }) => {
      await loginPage.login(USERS.manager.email, 'completely_wrong_password!');
      await loginPage.expectErrorVisible();
      await loginPage.expectStillOnLoginPage();
    });

  });

  // ── HTML5 client-side validation ─────────────────────────────

  test.describe('Empty field validation', () => {

    test('Submit with empty email → browser blocks, stays on login page', async ({ page }) => {
      await loginPage.passwordInput.fill(USERS.manager.password);
      await loginPage.loginButton.click();
      await loginPage.expectStillOnLoginPage();
    });

    test('Submit with empty password → browser blocks, stays on login page', async ({ page }) => {
      await loginPage.emailInput.fill(USERS.manager.email);
      await loginPage.loginButton.click();
      await loginPage.expectStillOnLoginPage();
    });

  });

});

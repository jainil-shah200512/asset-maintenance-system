const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ManagerPage } = require('../../pages/ManagerPage');

test.use({ storageState: 'auth/manager.json' });

test.describe('Logout functionality', () => {
  test('manager can log out and return to login page', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const loginPage = new LoginPage(page);

    // Start already authenticated
    await page.goto('/manager');
    await managerPage.expectLoaded();

    // Perform logout
    await managerPage.logout();

    // Verify user is back on login page
    await loginPage.expectLoginPageLoaded();

    // Optional extra safety: ensure user is no longer on manager route
    await expect(page).not.toHaveURL(/manager/i);
  });
});
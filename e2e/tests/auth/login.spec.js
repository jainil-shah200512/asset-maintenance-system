const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { testUsers } = require('../../fixtures/testUsers');

test.describe('Login functionality', () => {
  test('valid user can log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.expectLoginPageLoaded();

    await loginPage.login(
      testUsers.manager.email,
      testUsers.manager.password
    );

    await dashboardPage.expectLoaded();
  });

  test('invalid user should remain on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectLoginPageLoaded();

    await loginPage.login(
      testUsers.invalidUser.email,
      testUsers.invalidUser.password
    );

    await loginPage.expectStillOnLoginPage();
    await loginPage.expectLoginErrorIfVisible();

    await expect(page).not.toHaveURL(/manager|dashboard|technician|user/i);
  });
});

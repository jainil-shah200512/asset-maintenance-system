const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ManagerPage } = require('../../pages/ManagerPage');
const { testUsers } = require('../../fixtures/testUsers');

test('save manager auth state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const managerPage = new ManagerPage(page);

  await loginPage.goto();
  await loginPage.expectLoginPageLoaded();

  await loginPage.login(
    testUsers.manager.email,
    testUsers.manager.password
  );

  // Give the app a bit more time to redirect after login
  await expect(page).toHaveURL(/manager/i, { timeout: 15000 });

  // Also confirm actual manager page UI is visible
  await managerPage.expectLoaded();

  // Save authenticated session for reuse
  await page.context().storageState({ path: 'auth/manager.json' });
});
const { test } = require('@playwright/test');
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

  // Give auth time to settle in CI
  await page.waitForTimeout(3000);

  // If CI does not auto-redirect, force navigation to the authenticated route
  if (!page.url().includes('/manager')) {
    await page.goto('/manager');
  }

  // Verify actual manager shell is visible
  await managerPage.expectShellVisible();

  // Save authenticated session for reuse
  await page.context().storageState({ path: 'auth/manager.json' });
});
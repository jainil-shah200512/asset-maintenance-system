const { test } = require('@playwright/test');
const { ManagerPage } = require('../../pages/ManagerPage');

test.use({ storageState: 'auth/manager.json' });

test.describe('Manager home page', () => {
  test.describe.configure({ mode: 'serial' });

  test('manager can land on the manager dashboard using saved auth state', async ({ page }) => {
    const managerPage = new ManagerPage(page);

    await page.goto('/manager');

    await managerPage.expectLoaded();
    await managerPage.expectManagerIdentityVisible();
  });

  test('manager can open key navigation items using saved auth state', async ({ page }) => {
    const managerPage = new ManagerPage(page);

    await page.goto('/manager');

    await managerPage.expectLoaded();

    await managerPage.openTasks();
    await managerPage.openAssets();
    await managerPage.openStaff();
    await managerPage.openDashboard();
  });
});
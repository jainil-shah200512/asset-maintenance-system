const { test } = require('@playwright/test');
const { ManagerPage } = require('../../pages/ManagerPage');
const { StaffPage } = require('../../pages/StaffPage');

test.use({ storageState: 'auth/manager.json' });

test.describe('Staff page', () => {
  test.describe.configure({ mode: 'serial' });

  test('manager can open staff page and see key sections', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const staffPage = new StaffPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await staffPage.openFromManagerHome();
    await staffPage.expectLoaded();
    await staffPage.expectSummaryVisible();
  });

  test('manager can view the create technician form', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const staffPage = new StaffPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await staffPage.openFromManagerHome();
    await staffPage.expectLoaded();

    await staffPage.expectCreateTechnicianFormVisible();
  });

  test('manager can view the promote user section', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const staffPage = new StaffPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await staffPage.openFromManagerHome();
    await staffPage.expectLoaded();

    await staffPage.expectPromoteSectionVisible();
  });
});

const { test } = require('@playwright/test');
const { ManagerPage } = require('../../pages/ManagerPage');
const { AssetsPage } = require('../../pages/AssetsPage');

test.use({ storageState: 'auth/manager.json' });

test.describe('Assets page', () => {
  test.describe.configure({ mode: 'serial' });

  test('manager can open assets page and see key controls', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const assetsPage = new AssetsPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await assetsPage.openFromManagerHome();
    await assetsPage.expectLoaded();
    await assetsPage.expectSummaryVisible();
  });

  test('manager can use status filter on assets page', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const assetsPage = new AssetsPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await assetsPage.openFromManagerHome();
    await assetsPage.expectLoaded();

    await assetsPage.filterByStatus('OPERATIONAL');
    await assetsPage.filterByStatus('UNDER_MAINTENANCE');
    await assetsPage.filterByStatus('DECOMMISSIONED');
    await assetsPage.clearFilters();

    await assetsPage.expectLoaded();
  });

  test('manager can use search and clear on assets page', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const assetsPage = new AssetsPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await assetsPage.openFromManagerHome();
    await assetsPage.expectLoaded();

    await assetsPage.searchByText('asset');
    await assetsPage.clearFilters();

    await assetsPage.expectLoaded();
  });
});
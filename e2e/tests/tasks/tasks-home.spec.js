const { test } = require('@playwright/test');
const { ManagerPage } = require('../../pages/ManagerPage');
const { TasksPage } = require('../../pages/TasksPage');

test.use({ storageState: 'auth/manager.json' });

test.describe('Tasks page', () => {
  test.describe.configure({ mode: 'serial' });

  test('manager can open tasks page and see key controls', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const tasksPage = new TasksPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await tasksPage.openFromManagerHome();
    await tasksPage.expectLoaded();
    await tasksPage.expectSummaryVisible();
  });

  test('manager can use search and filter controls on tasks page', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const tasksPage = new TasksPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await tasksPage.openFromManagerHome();
    await tasksPage.expectLoaded();

    // Safe smoke interactions
    await tasksPage.searchByText('test');
    await tasksPage.filterByPriority('LOW');
    await tasksPage.clearFilters();
  });

  test('manager can open task details and navigate back', async ({ page }) => {
    const managerPage = new ManagerPage(page);
    const tasksPage = new TasksPage(page);

    await page.goto('/manager');
    await managerPage.expectLoaded();

    await tasksPage.openFromManagerHome();
    await tasksPage.expectLoaded();

    await tasksPage.showArchivedTasks();
    await tasksPage.showActiveTasks();

    await tasksPage.openFirstTaskDetails();
    await tasksPage.expectTaskDetailsLoaded();
    await tasksPage.goBackToTasks();

    await tasksPage.expectLoaded();
  });
});
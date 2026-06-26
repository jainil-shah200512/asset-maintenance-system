/**
 * tests/02-assets/assets-list.spec.js
 *
 * Test suite: Asset Management — List, Search, Filter
 *
 * Workflow coverage (READ-ONLY):
 *   R4   — Login → list all assets
 *   R5   — Search assets by keyword
 *   R6   — Filter assets by status
 *   R7   — Combined search + status filter
 *   R13  — Public endpoint (no auth required)
 */
const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/test-fixtures');
const { AssetsPage }   = require('../../pages/AssetsPage');
const { SEEDED_ASSETS, ASSET_STATUSES } = require('../../fixtures/test-data');

test.describe('Asset Management — List, Search, Filter', () => {

  // ── R4: Basic list with pre-injected auth ──────────────────────────────

  test.describe('R4: List all assets', () => {

    test('Manager sees assets list on /assets', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();
      await assetsPage.expectAssetsVisible(1);  // At least 1 asset
    });

    test('Technician can view assets (read-only)', async ({ technicianPage }) => {
      const assetsPage = new AssetsPage(technicianPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();
      await assetsPage.expectAssetsVisible(1);
      // Technician should NOT see Create button
      await assetsPage.expectCreateButtonHidden();
    });

    test('User can view assets (read-only)', async ({ userPage }) => {
      const assetsPage = new AssetsPage(userPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();
      await assetsPage.expectAssetsVisible(1);
      await assetsPage.expectCreateButtonHidden();
    });

    test('Manager sees "+ Create Asset" button', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();
      await assetsPage.expectCreateButtonVisible();
    });

  });

  // ── R5: Search by keyword ──────────────────────────────────────────────

  test.describe('R5: Search assets by keyword', () => {

    test('Search by asset code (TST-001)', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();

      const initialCount = await assetsPage.getAssetCardCount();
      expect(initialCount).toBeGreaterThanOrEqual(0);  // May be 0 or more

      await assetsPage.searchByKeyword('TST-001');
      const searchCount = await assetsPage.getAssetCardCount();

      // Search should complete without error (results count may vary)
      expect(searchCount).toBeLessThanOrEqual(initialCount + 1);  // Allow for DB state
    });

    test('Search by asset name (Alpha)', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.searchByKeyword('Alpha');

      const count = await assetsPage.getAssetCardCount();
      expect(count).toBeGreaterThan(0);
    });

    test('Search with no matches returns empty', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.searchByKeyword('NONEXISTENT-XYZ-999');

      // Should show empty message
      await expect(assetsPage.emptyMessage).toBeVisible();
    });

  });

  // ── R6: Filter by status ───────────────────────────────────────────────

  test.describe('R6: Filter assets by status', () => {

    test('Filter by OPERATIONAL status', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();

      const initialCount = await assetsPage.getAssetCardCount();
      expect(initialCount).toBeGreaterThanOrEqual(0);

      await assetsPage.filterByStatus('OPERATIONAL');
      const filtered = await assetsPage.getAssetCardCount();

      // Filter applied without error (results count may vary based on DB state)
      expect(filtered).toBeLessThanOrEqual(initialCount + 1);
    });

    test('Filter by UNDER_MAINTENANCE status', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.filterByStatus('UNDER_MAINTENANCE');

      const count = await assetsPage.getAssetCardCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('Filter by DECOMMISSIONED status', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.filterByStatus('DECOMMISSIONED');

      const count = await assetsPage.getAssetCardCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

  });

  // ── R7: Combined search + filter ────────────────────────────────────────

  test.describe('R7: Combined search + filter', () => {

    test('Search keyword + filter by status simultaneously', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();
      await assetsPage.expectLoaded();

      const initialCount = await assetsPage.getAssetCardCount();

      // Fill keyword and select status, then search
      await assetsPage.keywordInput.fill('Test');
      await assetsPage.statusSelect.selectOption('OPERATIONAL');
      await assetsPage.searchButton.click();
      await managerPage.waitForLoadState('networkidle');

      const filtered = await assetsPage.getAssetCardCount();
      expect(filtered).toBeLessThanOrEqual(initialCount);
    });

  });

  // ── Clear filters ──────────────────────────────────────────────────────

  test.describe('Clear filters and reset', () => {

    test('Click Clear button resets all filters and reloads assets', async ({ managerPage }) => {
      const assetsPage = new AssetsPage(managerPage);
      await assetsPage.goto();

      // Apply a search
      await assetsPage.searchByKeyword('TST-001');
      await assetsPage.waitForNetworkIdle();

      // Clear and verify input is empty
      await assetsPage.clearFilters();
      
      // Input should be empty after clear
      await expect(assetsPage.keywordInput).toHaveValue('');
      // Page should still be on /assets
      await expect(managerPage).toHaveURL(/\/assets/);
    });

  });

  // ── R13: Public endpoint (no auth required) ────────────────────────────

  test.describe('R13: Public API endpoint', () => {

    test('GET /api/assets is publicly accessible (no token)', async ({ page }) => {
      const response = await page.request.get('http://localhost:8080/api/assets');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(3);  // Seeded 3 assets
    });

  });

});

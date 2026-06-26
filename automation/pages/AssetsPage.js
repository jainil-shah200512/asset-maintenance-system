/**
 * pages/AssetsPage.js
 *
 * Covers the asset list page at '/assets'.
 * All roles can view; only MANAGER sees Create / Edit / Delete.
 */
const { expect }   = require('@playwright/test');
const { BasePage } = require('./BasePage');

class AssetsPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // ── Header ─────────────────────────────────────────────────
    this.heading       = page.getByRole('heading', { name: /^assets$/i });
    this.subText       = page.getByText(/browse, search, and manage/i);
    this.createButton  = page.getByRole('button',  { name: /\+ create asset/i });

    // ── Search / filter form ────────────────────────────────────
    this.keywordInput  = page.getByRole('textbox', { name: /search by code, name/i });
    this.statusSelect  = page.getByRole('combobox');
    this.searchButton  = page.getByRole('button',  { name: /^search$/i });
    this.clearButton   = page.getByRole('button',  { name: /^clear$/i });

    // ── Content ─────────────────────────────────────────────────
    // Each AssetCard is a white rounded card with specific tailwind classes
    this.assetCards    = page.locator('.rounded-2xl.bg-white.p-5.shadow');
    this.emptyMessage  = page.getByText(/no assets found/i);
    this.loadingText   = page.getByText(/loading assets/i);
    this.errorBanner   = page.locator('.bg-red-50').first();
  }

  async goto() {
    await this.page.goto('/assets');
  }

  /** Assert the page shell has fully rendered */
  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.keywordInput).toBeVisible();
    await expect(this.statusSelect).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
    // Loading spinner must be gone
    await expect(this.loadingText).not.toBeVisible();
  }

  /** Assert at least `min` asset cards are shown */
  async expectAssetsVisible(min = 1) {
    await this.page.waitForLoadState('networkidle');
    const count = await this.assetCards.count();
    expect(count).toBeGreaterThanOrEqual(min);
  }

  /** Return the current number of rendered asset cards */
  async getAssetCardCount() {
    await this.page.waitForLoadState('networkidle');
    return this.assetCards.count();
  }

  async searchByKeyword(keyword) {
    await this.keywordInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status) {
    await this.statusSelect.selectOption(status);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters() {
    await this.clearButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Verify the "+ Create Asset" button is visible (MANAGER only) */
  async expectCreateButtonVisible() {
    await expect(this.createButton).toBeVisible();
  }

  /** Verify the "+ Create Asset" button is NOT present (non-MANAGER) */
  async expectCreateButtonHidden() {
    await expect(this.createButton).not.toBeVisible();
  }

  async clickCreateAsset() {
    await this.createButton.click();
    await expect(this.page).toHaveURL('/assets/new');
  }

  /**
   * Click the Edit button on a specific asset card by index (0-based).
   * Only available when role === MANAGER.
   */
  async clickEditOnCard(index = 0) {
    const card = this.assetCards.nth(index);
    await card.getByRole('button', { name: /^edit$/i }).click();
    await expect(this.page).toHaveURL(/\/assets\/\d+\/edit/);
  }

  /**
   * Click Delete on a specific card and confirm the browser dialog.
   * Only available when role === MANAGER.
   * ⚠️ DESTRUCTIVE — mark as such in tests.
   */
  async clickDeleteOnCard(index = 0) {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.assetCards.nth(index)
      .getByRole('button', { name: /^delete$/i })
      .click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { AssetsPage };

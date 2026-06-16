const { expect } = require('@playwright/test');

class AssetsPage {
  constructor(page) {
    this.page = page;

    // Locators based on your Codegen output
    this.assetsNavButton = page.getByRole('button', { name: 'Assets' });
    this.assetsHeading = page.getByRole('heading', { name: 'Assets' });
    this.assetsDescription = page.getByText('Browse, search, and manage');

    this.searchInput = page.getByRole('textbox', { name: /search by code, name, or/i });
    this.statusSelect = page.getByRole('combobox');

    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.clearButton = page.getByRole('button', { name: 'Clear' });
  }

  async openFromManagerHome() {
    await this.assetsNavButton.click();
  }

  async expectLoaded() {
    await expect(this.assetsHeading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.statusSelect).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
  }

  async expectSummaryVisible() {
    await expect(this.assetsDescription).toBeVisible();
  }

  async searchByText(searchText) {
    await this.searchInput.fill(searchText);
    await this.searchButton.click();
  }

  async filterByStatus(statusValue) {
    await this.statusSelect.selectOption(statusValue);
    await this.searchButton.click();
  }

  async clearFilters() {
    await this.clearButton.click();
  }
}

module.exports = { AssetsPage };
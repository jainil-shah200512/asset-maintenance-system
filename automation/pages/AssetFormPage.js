/**
 * pages/AssetFormPage.js
 *
 * Covers create ('/assets/new') and edit ('/assets/:id/edit') forms.
 * MANAGER role only.
 */
const { expect }   = require('@playwright/test');
const { BasePage } = require('./BasePage');

class AssetFormPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading        = page.getByRole('heading', { name: /create asset|edit asset/i });
    this.assetCodeInput = page.getByRole('textbox', { name: /asset code/i });
    this.nameInput      = page.getByRole('textbox', { name: /asset name/i });
    this.locationInput  = page.getByRole('textbox', { name: /location/i });
    this.statusSelect   = page.getByRole('combobox');
    this.saveButton     = page.getByRole('button',  { name: /save asset|create|update/i });
    this.backButton     = page.getByRole('button',  { name: /back to assets/i });
    this.errorBanner    = page.locator('.bg-red-50').first();
  }

  async gotoCreate() {
    await this.page.goto('/assets/new');
  }

  async gotoEdit(assetId) {
    await this.page.goto(`/assets/${assetId}/edit`);
  }

  /** Assert the create/edit form is fully rendered */
  async expectLoaded() {
    await expect(this.assetCodeInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.statusSelect).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  /**
   * Fill the form fields.
   * @param {{ assetCode: string, name: string, location?: string, status?: string }} data
   */
  async fillForm({ assetCode, name, location = '', status = 'OPERATIONAL' }) {
    await this.assetCodeInput.fill(assetCode);
    await this.nameInput.fill(name);
    if (location) await this.locationInput.fill(location);
    await this.statusSelect.selectOption(status);
  }

  async submit() {
    await this.saveButton.click();
  }

  /**
   * Fill and submit the form, then assert redirect back to /assets.
   */
  async fillAndSubmit(data) {
    await this.fillForm(data);
    await this.submit();
    await expect(this.page).toHaveURL('/assets');
  }

  async expectErrorVisible() {
    await expect(this.errorBanner).toBeVisible();
  }

  async goBack() {
    await this.backButton.click();
    await expect(this.page).toHaveURL('/assets');
  }
}

module.exports = { AssetFormPage };

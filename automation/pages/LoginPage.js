/**
 * pages/LoginPage.js
 *
 * Covers the public login screen at '/'.
 */
const { expect }   = require('@playwright/test');
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.emailInput    = page.getByRole('textbox', { name: /enter your email/i });
    this.passwordInput = page.getByRole('textbox', { name: /enter your password/i });
    this.loginButton   = page.getByRole('button',  { name: /^login$/i });
    this.errorBanner   = page.locator('.bg-red-50').first();
    this.registerLink  = page.getByRole('link',    { name: /register/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  /** Assert the login form is fully rendered */
  async expectLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /** Fill and submit the login form */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Assert an inline error banner is shown */
  async expectErrorVisible() {
    await expect(this.errorBanner).toBeVisible();
  }

  /** Assert the user is still on the login page (login was rejected) */
  async expectStillOnLoginPage() {
    await expect(this.page).toHaveURL('/');
    await expect(this.emailInput).toBeVisible();
  }
}

module.exports = { LoginPage };

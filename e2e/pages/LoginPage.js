const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    // Exact locators from Playwright Codegen
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectLoginPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectStillOnLoginPage() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async expectLoginErrorIfVisible() {
    const possibleError = this.page.getByText(
      /invalid|incorrect|failed|unauthorized|error|bad credentials|user not found/i
    );

    if (await possibleError.count()) {
      await expect(possibleError.first()).toBeVisible();
    }
  }
}

module.exports = { LoginPage };
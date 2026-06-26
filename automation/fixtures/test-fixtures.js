/**
 * fixtures/test-fixtures.js
 *
 * Extends Playwright's base `test` with pre-authenticated page fixtures.
 *
 * Usage:
 *   const { test } = require('../../fixtures/test-fixtures');
 *
 *   test('assets page as manager', async ({ managerPage }) => {
 *     await managerPage.goto('/assets');
 *   });
 */
const { test: base } = require('@playwright/test');
const { injectAuthState } = require('../helpers/auth-helper');

const test = base.extend({

  /** Page with MANAGER auth pre-injected into localStorage */
  managerPage: async ({ page }, use) => {
    await injectAuthState(page, 'manager');
    await use(page);
  },

  /** Page with TECHNICIAN auth pre-injected into localStorage */
  technicianPage: async ({ page }, use) => {
    await injectAuthState(page, 'technician');
    await use(page);
  },

  /** Page with USER auth pre-injected into localStorage */
  userPage: async ({ page }, use) => {
    await injectAuthState(page, 'user');
    await use(page);
  },

  /** Page with ADMIN auth pre-injected into localStorage */
  adminPage: async ({ page }, use) => {
    await injectAuthState(page, 'admin');
    await use(page);
  },

});

module.exports = { test };

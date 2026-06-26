/**
 * helpers/auth-helper.js
 *
 * Two strategies for authenticating in tests:
 *
 * 1. loginViaUI(page, role)
 *    — Full browser login through the Login page.
 *    — Slower. Use only in tests that explicitly test the login flow.
 *
 * 2. injectAuthState(page, role)
 *    — Bypasses the UI entirely. Calls the login API, then injects the
 *      JWT + user data into localStorage via addInitScript.
 *    — Fast. Use for all tests where login itself is not the subject.
 */
const env           = require('../config/env');
const { apiPost }   = require('./api-client');

/**
 * Call the login API and return the auth payload.
 * @param {'manager'|'technician'|'user'|'admin'} role
 * @returns {{ token: string, email: string, role: string, fullName: string }}
 */
async function getAuthToken(role = 'manager') {
  const creds = env.users[role];
  if (!creds) throw new Error(`Unknown role: "${role}". Valid: manager, technician, user, admin`);

  const result = await apiPost('/auth/login', {
    email:    creds.email,
    password: creds.password,
  });

  if (result.status !== 200 || !result.data?.token) {
    throw new Error(
      `getAuthToken failed for role "${role}" (${creds.email})\n` +
      `Status: ${result.status}\n` +
      `Run "npm run seed" to create test users.`
    );
  }

  return result.data;
}

/**
 * Inject JWT auth state into browser localStorage before any navigation.
 * Must be called before page.goto() — uses addInitScript.
 *
 * @param {import('@playwright/test').Page} page
 * @param {'manager'|'technician'|'user'|'admin'} role
 */
async function injectAuthState(page, role = 'manager') {
  const authData = await getAuthToken(role);

  await page.addInitScript(
    ({ token, email, roleVal, fullName }) => {
      localStorage.setItem('token',    token);
      localStorage.setItem('role',     roleVal);
      localStorage.setItem('email',    email);
      localStorage.setItem('fullName', fullName);
    },
    {
      token:    authData.token,
      email:    authData.email,
      roleVal:  authData.role,
      fullName: authData.fullName,
    }
  );
}

module.exports = { getAuthToken, injectAuthState };

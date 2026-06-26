/**
 * setup/global-setup.js
 *
 * Playwright global setup — runs ONCE before the entire test suite.
 *
 * Responsibilities:
 *  1. Verify the backend is reachable
 *  2. Verify the frontend is reachable
 *  3. Validate that all test user credentials can actually log in
 *
 * If any check fails the suite stops immediately with a clear message.
 * Run "npm run seed" first if users are missing.
 */
require('dotenv').config({ path: '.env.local' });

const env         = require('../config/env');
const { apiGet, apiPost } = require('../helpers/api-client');

async function globalSetup() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🔧  GLOBAL SETUP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ── 1. Backend health ────────────────────────────────────────
  console.log(`📡  Backend  →  ${env.apiUrl}`);
  let backendOk = false;
  try {
    const res = await apiGet('/assets');
    backendOk = res.status === 200;
  } catch (err) {
    // fetch throws on network error
  }

  if (!backendOk) {
    throw new Error(
      `\n❌  Backend not reachable at ${env.apiUrl}\n` +
      `    Make sure the Spring Boot server is running on port 8080.\n`
    );
  }
  console.log('    ✅  Backend is up\n');

  // ── 2. Validate test user credentials ────────────────────────
  console.log('🔑  Validating test credentials...\n');

  const checks = [
    { label: 'MANAGER',    creds: env.users.manager },
    { label: 'TECHNICIAN', creds: env.users.technician },
    { label: 'USER',       creds: env.users.user },
    { label: 'ADMIN',      creds: env.users.admin },
  ];

  for (const { label, creds } of checks) {
    const res = await apiPost('/auth/login', {
      email:    creds.email,
      password: creds.password,
    });

    if (res.status !== 200 || !res.data?.token) {
      throw new Error(
        `\n❌  Login failed for ${label} (${creds.email})\n` +
        `    HTTP ${res.status}\n\n` +
        `    ▶  Fix: run  npm run seed  to create test users.\n`
      );
    }

    console.log(`    ✅  ${label.padEnd(12)} ${creds.email}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ✅  All systems ready. Running tests...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

module.exports = globalSetup;

/**
 * helpers/api-client.js
 *
 * Thin HTTP wrapper around Node's native fetch.
 * Used by setup scripts and auth helpers — NOT inside browser context.
 *
 * Node 18+ required (native fetch).
 */
const env = require('../config/env');

/**
 * POST request to the backend API.
 * @param {string} path        - e.g. '/auth/login'
 * @param {object} body        - JSON body
 * @param {string|null} token  - optional Bearer token
 * @returns {{ status: number, data: any }}
 */
async function apiPost(path, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, {
    method:  'POST',
    headers,
    body:    JSON.stringify(body),
  });

  let data = null;
  try { data = await res.json(); } catch (_) { /* non-JSON response */ }

  return { status: res.status, data };
}

/**
 * GET request to the backend API.
 * @param {string} path        - e.g. '/assets'
 * @param {string|null} token  - optional Bearer token
 * @returns {{ status: number, data: any }}
 */
async function apiGet(path, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, { headers });

  let data = null;
  try { data = await res.json(); } catch (_) { /* non-JSON response */ }

  return { status: res.status, data };
}

module.exports = { apiPost, apiGet };

/**
 * fixtures/test-data.js
 *
 * Static constants that mirror what the seed script inserts.
 * Import these in tests instead of hardcoding values inline.
 */
const env = require('../config/env');

// ── User credentials ──────────────────────────────────────────────────────────

const USERS = env.users;  // { manager, technician, user, admin }

const INVALID_CREDENTIALS = {
  email:    'nobody@invalid-domain.com',
  password: 'WrongPassword999!',
};

// ── Seeded assets (created by setup/seed.js) ─────────────────────────────────

const SEEDED_ASSETS = [
  { assetCode: 'TST-001', name: 'Test Asset Alpha', location: 'Lab Room 1',  status: 'OPERATIONAL'       },
  { assetCode: 'TST-002', name: 'Test Asset Beta',  location: 'Lab Room 2',  status: 'UNDER_MAINTENANCE' },
  { assetCode: 'TST-003', name: 'Test Asset Gamma', location: 'Warehouse A', status: 'DECOMMISSIONED'    },
];

// ── Domain enums ──────────────────────────────────────────────────────────────

const ASSET_STATUSES = ['OPERATIONAL', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const TASK_STATUSES = [
  'REPORTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_MATERIAL_APPROVAL',
  'MATERIAL_APPROVED',
  'MATERIAL_REJECTED',
  'COMPLETED',
  'REWORK_REQUIRED',
  'CONFIRMED',
  'CLOSED',
];

// ── Role → expected post-login URL ───────────────────────────────────────────

const ROLE_REDIRECT = {
  MANAGER:    '/manager',
  TECHNICIAN: '/technician',
  USER:       '/user',
  ADMIN:      '/admin',
};

module.exports = {
  USERS,
  INVALID_CREDENTIALS,
  SEEDED_ASSETS,
  ASSET_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  ROLE_REDIRECT,
};

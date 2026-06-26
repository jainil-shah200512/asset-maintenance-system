/**
 * config/env.js
 *
 * Single source of truth for all environment variables.
 * All other modules import from here — never read process.env directly.
 */
require('dotenv').config({ path: '.env.local' });

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl:  process.env.API_URL  || 'http://localhost:8080/api',

  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME     || 'asset_maintenance',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '12345',
  },

  users: {
    manager: {
      email:    process.env.TEST_MANAGER_EMAIL    || 'manager@test.com',
      password: process.env.TEST_MANAGER_PASSWORD || 'Manager@1234',
    },
    technician: {
      email:    process.env.TEST_TECHNICIAN_EMAIL    || 'technician@test.com',
      password: process.env.TEST_TECHNICIAN_PASSWORD || 'Tech@1234',
    },
    user: {
      email:    process.env.TEST_USER_EMAIL    || 'user@test.com',
      password: process.env.TEST_USER_PASSWORD || 'User@1234',
    },
    admin: {
      email:    process.env.TEST_ADMIN_EMAIL    || 'admin@test.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'Admin@1234',
    },
  },
};

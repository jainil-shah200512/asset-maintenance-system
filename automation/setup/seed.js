/**
 * setup/seed.js
 *
 * One-time idempotent seed script.
 * Creates test roles, users, and assets directly in PostgreSQL.
 *
 * Usage:
 *   npm run seed
 *
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 * Passwords are hashed with bcryptjs (same algorithm as Spring BCryptPasswordEncoder).
 */
require('dotenv').config({ path: '.env.local' });

const { Client } = require('pg');
const bcrypt     = require('bcryptjs');
const env        = require('../config/env');

// ── Seed data ───────────────────────────────────────────────────────────────

const ROLES = ['USER', 'TECHNICIAN', 'MANAGER', 'ADMIN'];

const USERS = [
  {
    firstName: 'Test',
    lastName:  'Manager',
    email:     env.users.manager.email,
    password:  env.users.manager.password,
    role:      'MANAGER',
  },
  {
    firstName: 'Test',
    lastName:  'Technician',
    email:     env.users.technician.email,
    password:  env.users.technician.password,
    role:      'TECHNICIAN',
  },
  {
    firstName: 'Test',
    lastName:  'User',
    email:     env.users.user.email,
    password:  env.users.user.password,
    role:      'USER',
  },
  {
    firstName: 'Test',
    lastName:  'Admin',
    email:     env.users.admin.email,
    password:  env.users.admin.password,
    role:      'ADMIN',
  },
];

const ASSETS = [
  { assetCode: 'TST-001', name: 'Test Asset Alpha', location: 'Lab Room 1',  status: 'OPERATIONAL'       },
  { assetCode: 'TST-002', name: 'Test Asset Beta',  location: 'Lab Room 2',  status: 'UNDER_MAINTENANCE' },
  { assetCode: 'TST-003', name: 'Test Asset Gamma', location: 'Warehouse A', status: 'DECOMMISSIONED'     },
];

const SALT_ROUNDS = 10;

// ── Helpers ─────────────────────────────────────────────────────────────────

function ok(msg)   { console.log(`   ✅  ${msg}`); }
function skip(msg) { console.log(`   ⏭️   ${msg} (already exists)`); }
function info(msg) { console.log(`\n${msg}`); }

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const client = new Client({
    host:     env.db.host,
    port:     env.db.port,
    database: env.db.database,
    user:     env.db.user,
    password: env.db.password,
  });

  try {
    await client.connect();
    console.log(`\n✅  Connected to PostgreSQL @ ${env.db.host}:${env.db.port}/${env.db.database}`);

    // ── 1. Roles ────────────────────────────────────────────────
    info('📌  Seeding roles...');
    for (const roleName of ROLES) {
      const r = await client.query(
        `INSERT INTO roles (role_name)
         VALUES ($1)
         ON CONFLICT (role_name) DO NOTHING
         RETURNING id`,
        [roleName]
      );
      r.rowCount > 0 ? ok(`Role: ${roleName}`) : skip(`Role: ${roleName}`);
    }

    // ── 2. Users ────────────────────────────────────────────────
    info('👤  Seeding users...');
    for (const user of USERS) {
      // Resolve role ID
      const roleRow = await client.query(
        `SELECT id FROM roles WHERE role_name = $1`, [user.role]
      );
      if (!roleRow.rows.length) {
        throw new Error(`Role "${user.role}" not found in DB. Did roles seed succeed?`);
      }
      const roleId = roleRow.rows[0].id;

      // Hash password with Spring-compatible BCrypt
      const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);

      const r = await client.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, role_id, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, true, NOW())
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [user.firstName, user.lastName, user.email, passwordHash, roleId]
      );
      r.rowCount > 0
        ? ok(`User: ${user.email}  (${user.role})`)
        : skip(`User: ${user.email}`);
    }

    // ── 3. Assets ───────────────────────────────────────────────
    info('🏭  Seeding assets...');
    for (const asset of ASSETS) {
      const r = await client.query(
        `INSERT INTO assets (asset_code, name, location, status, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (asset_code) DO NOTHING
         RETURNING id`,
        [asset.assetCode, asset.name, asset.location, asset.status]
      );
      r.rowCount > 0
        ? ok(`Asset: ${asset.assetCode} — ${asset.name}`)
        : skip(`Asset: ${asset.assetCode}`);
    }

    // ── Summary ─────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉  Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('  Test credentials:\n');
    for (const u of USERS) {
      console.log(`  ${u.role.padEnd(12)} →  ${u.email}  /  ${u.password}`);
    }
    console.log('');

  } catch (err) {
    console.error(`\n❌  Seed failed: ${err.message}\n`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();

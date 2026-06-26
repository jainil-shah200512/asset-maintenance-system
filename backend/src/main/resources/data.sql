-- Initialize test data for CI/CD pipeline
-- Test Users with pre-hashed passwords

-- Create roles if they don't exist
INSERT INTO role (name) VALUES ('MANAGER') ON CONFLICT DO NOTHING;
INSERT INTO role (name) VALUES ('TECHNICIAN') ON CONFLICT DO NOTHING;
INSERT INTO role (name) VALUES ('USER') ON CONFLICT DO NOTHING;

-- Create test users (adjust passwords based on your backend hashing)
-- Note: These are placeholder queries - adjust based on your actual User/Role table structure
INSERT INTO "user" (email, password, role_id, created_at, updated_at) 
SELECT 'manager@test.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DQwAjqAH5eNjigNV9nUtNrgQlC/v0m', r.id, NOW(), NOW()
FROM role r WHERE r.name = 'MANAGER'
ON CONFLICT (email) DO NOTHING;

INSERT INTO "user" (email, password, role_id, created_at, updated_at)
SELECT 'technician@test.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DQwAjqAH5eNjigNV9nUtNrgQlC/v0m', r.id, NOW(), NOW()
FROM role r WHERE r.name = 'TECHNICIAN'
ON CONFLICT (email) DO NOTHING;

INSERT INTO "user" (email, password, role_id, created_at, updated_at)
SELECT 'user@test.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DQwAjqAH5eNjigNV9nUtNrgQlC/v0m', r.id, NOW(), NOW()
FROM role r WHERE r.name = 'USER'
ON CONFLICT (email) DO NOTHING;

-- Create sample assets
INSERT INTO asset (code, name, description, status, created_by, created_at, updated_at)
VALUES 
  ('TST-001', 'Alpha Equipment', 'Test asset alpha', 'OPERATIONAL', 1, NOW(), NOW()),
  ('TST-002', 'Beta Equipment', 'Test asset beta', 'UNDER_MAINTENANCE', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

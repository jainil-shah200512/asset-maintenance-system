-- Initialize test data for CI/CD pipeline
-- Test data with bcrypt hashed passwords: Manager@1234, Tech@1234, User@1234

-- Create roles (ignore if already exist)
INSERT INTO role (name) VALUES ('MANAGER');
INSERT INTO role (name) VALUES ('TECHNICIAN');
INSERT INTO role (name) VALUES ('USER');

-- Create test users
INSERT INTO "user" (email, password, role_id, created_at, updated_at) 
VALUES ('manager@test.com', '$2a$10$Vd.jFWVjLBNTGO58B/5fO.yGh2BRhY3iQP1sC8YK9pNM7SaLn8i5.', 
        (SELECT id FROM role WHERE name = 'MANAGER'), NOW(), NOW());

INSERT INTO "user" (email, password, role_id, created_at, updated_at)
VALUES ('technician@test.com', '$2a$10$2RmSU5BqBkOKP4M0q.LyLOx0V6U6.qPV7lPvCJPyLhWJLLWOYEPEm', 
        (SELECT id FROM role WHERE name = 'TECHNICIAN'), NOW(), NOW());

INSERT INTO "user" (email, password, role_id, created_at, updated_at)
VALUES ('user@test.com', '$2a$10$2h0UKpKe1K8pOKFPkVLFGuO/xLZcXrPKmSjQp5LJnFMr6TCKh8Qr.', 
        (SELECT id FROM role WHERE name = 'USER'), NOW(), NOW());

-- Create sample assets (using user_id 1 as creator)
INSERT INTO asset (code, name, description, status, created_by, created_at, updated_at)
VALUES 
  ('TST-001', 'Alpha Equipment', 'Test asset alpha', 'OPERATIONAL', 1, NOW(), NOW()),
  ('TST-002', 'Beta Equipment', 'Test asset beta', 'UNDER_MAINTENANCE', 1, NOW(), NOW());

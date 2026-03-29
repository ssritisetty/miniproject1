-- Seed roles if they don't exist
INSERT INTO roles (name) SELECT 'ROLE_CUSTOMER' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_CUSTOMER');
INSERT INTO roles (name) SELECT 'ROLE_PROVIDER' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_PROVIDER');
INSERT INTO roles (name) SELECT 'ROLE_ADMIN'    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

-- Seed categories if they don't exist
INSERT INTO categories (name, description) SELECT 'Plumbing', 'All kinds of plumbing repairs and installations' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Plumbing');
INSERT INTO categories (name, description) SELECT 'Electrical', 'Expert home wiring, circuits, and repairs' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electrical');
INSERT INTO categories (name, description) SELECT 'Carpentry', 'Furniture assembly, repairs, and custom woodwork' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Carpentry');
INSERT INTO categories (name, description) SELECT 'Cleaning', 'Professional home and office cleaning services' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Cleaning');

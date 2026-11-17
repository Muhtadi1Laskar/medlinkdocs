-- migrate:up
ALTER TABLE users ADD COLUMN password TEXT NOT NULL;

-- migrate:down
ALTER TABLE users DROP COLUMN password;


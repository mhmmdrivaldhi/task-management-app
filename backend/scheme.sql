
-- DATABASE SCHEMA: Task Management App --

-- Drop tables if re-running --
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;
-- Users table -- 
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255)        NOT NULL,
  created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);
-- Tasks table --
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200)  NOT NULL,
  description TEXT,
  completed   BOOLEAN       NOT NULL DEFAULT FALSE,
  user_id     INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id  ON tasks(user_id);
CREATE INDEX idx_users_email    ON users(email);
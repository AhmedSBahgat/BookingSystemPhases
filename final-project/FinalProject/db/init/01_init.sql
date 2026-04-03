CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

INSERT INTO users (name, email)
VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  booking_date DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

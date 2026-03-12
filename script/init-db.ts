import "dotenv/config";
import pool from "../src/lib/db";
async function initDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      INSERT INTO users (id, username, email, password, first_name, last_name)
      VALUES (1, 'legacy_user', 'legacy-user@local.dev', 'legacy_password', 'Legacy', 'User')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      SELECT setval(pg_get_serial_sequence('users', 'id'), GREATEST((SELECT MAX(id) FROM users), 1), true);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        title VARCHAR(255),
        description TEXT,
        parent_id INTEGER,
        location VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS parent_id INTEGER;`);
    await client.query(`
      DO $$
      DECLARE fk RECORD;
      BEGIN
        FOR fk IN
          SELECT c.conname
          FROM pg_constraint c
          JOIN pg_class t ON t.oid = c.conrelid
          JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
          WHERE c.contype = 'f'
            AND t.relname = 'posts'
            AND a.attname = 'user_id'
        LOOP
          EXECUTE format('ALTER TABLE posts DROP CONSTRAINT IF EXISTS %I', fk.conname);
        END LOOP;
      END $$;
    `);
    await client.query(`ALTER TABLE posts ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;`);
    await client.query(`
      DELETE FROM posts p
      WHERE p.user_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM "User" u
        WHERE u.id = p.user_id
      );
    `);
    await client.query(`
      ALTER TABLE posts
      ADD CONSTRAINT posts_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES "User"(id)
      ON DELETE CASCADE;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        announce_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reposts (
        id SERIAL PRIMARY KEY,
        announce_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS friendships (
        id SERIAL PRIMARY KEY,
        requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        addressee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(10) NOT NULL DEFAULT 'PENDING'
          CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (requester_id, addressee_id)
      );
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();

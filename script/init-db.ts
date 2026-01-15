import 'dotenv/config';
import pool from "../src/lib/db";
async function initDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    // Création de la table users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        pseudo VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        role VARCHAR(50) NOT NULL, -- employer | nounou
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ajoutez d'autres tables ici
    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("✅ Tables créées avec succès");
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Erreur lors de la création des tables:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();

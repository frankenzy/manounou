import { Pool } from "pg";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Test de connexion
pool.on("connect", () => {
  console.log("✅ Connecté à la base de données PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Erreur de connexion à la base de données:", err);
});

export default pool;

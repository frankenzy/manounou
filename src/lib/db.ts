import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                          // Nombre max de connexions dans le pool
  idleTimeoutMillis: 30000,         // Fermer les connexions inactives après 30s
  connectionTimeoutMillis: 10000,   // Timeout de connexion à 10s (augmenté)
  statement_timeout: 30000,         // Timeout des requêtes à 30s (augmenté)
  query_timeout: 30000,             // Timeout global des queries à 30s
  ssl: false,                       // Désactiver SSL en dev pour performance
});

pool.on("connect", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Connecté à la base de données PostgreSQL");
  }
});

pool.on("error", (err) => {
  console.error("❌ Erreur de connexion à la base de données:", err);
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};

export default pool;

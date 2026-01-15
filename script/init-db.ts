import db from "../src/lib/db";

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NULL UNIQUE,
    email TEXT NULL UNIQUE,
    phone TEXT  NULL,
    role TEXT NOT NULL, -- employer | nounou
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("✅ Tables créées avec succès");

import 'dotenv/config';
import pool from "../src/lib/db";

async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Seed users
    const users = [
      {
        pseudo: "marie_nounou",
        email: "marie@example.com",
        phone: "+33612345678",
        role: "nounou",
      },
      {
        pseudo: "jean_parent",
        email: "jean@example.com",
        phone: "+33698765432",
        role: "employer",
      },
      {
        pseudo: "sophie_nounou",
        email: "sophie@example.com",
        phone: "+33656781234",
        role: "nounou",
      },
    ];

    for (const user of users) {
      await client.query(
        `INSERT INTO users (pseudo, email, phone, role) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [user.pseudo, user.email, user.phone, user.role]
      );
    }

    console.log(`✅ ${users.length} utilisateurs ajoutés`);

    // Seed announcements
    const announcements = [
      {
        user_id: 2, // jean_parent
        title: "Recherche nounou à temps partiel",
        description: "Nous recherchons une nounou expérimentée pour garder nos 2 enfants (3 et 5 ans) les mercredis après-midi.",
        location: "Paris 15ème",
      },
      {
        user_id: 2,
        title: "Garde d'enfants pendant les vacances",
        description: "Besoin d'une nounou fiable pour juillet et août.",
        location: "Lyon",
      },
    ];

    for (const announcement of announcements) {
      await client.query(
        `INSERT INTO announcements (user_id, title, description, location) 
         VALUES ($1, $2, $3, $4)`,
        [
          announcement.user_id,
          announcement.title,
          announcement.description,
          announcement.location,
        ]
      );
    }

    console.log(`✅ ${announcements.length} annonces ajoutées`);

    await client.query("COMMIT");
    console.log("✅ Base de données seedée avec succès");
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Erreur lors du seed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

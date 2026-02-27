import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   const seedEmail = (process.env.SEED_USER_EMAIL || "demo@manounou.fr").trim().toLowerCase();
   const seedPassword = process.env.SEED_USER_PASSWORD || "DemoPass123";
   const seedFirstName = process.env.SEED_USER_FIRSTNAME || "Demo";
   const seedLastName = process.env.SEED_USER_LASTNAME || "User";

   const passwordHash = await bcrypt.hash(seedPassword, 10);

   await prisma.user.upsert({
      where: { email: seedEmail },
      update: {
         passwordHash,
         firstName: seedFirstName,
         lastName: seedLastName,
      },
      create: {
         email: seedEmail,
         passwordHash,
         firstName: seedFirstName,
         lastName: seedLastName,
      },
   });

   console.log(`✅ Seed user ready: ${seedEmail}`);
}

main()
   .catch((error) => {
      console.error("❌ Prisma seed error:", error);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });

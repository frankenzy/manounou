import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
   const seedEmail = (process.env.SEED_USER_EMAIL || "frankenzyvenus@gmail.com")
      .trim()
      .toLowerCase();
   const seedPassword = process.env.SEED_USER_PASSWORD || "Password12344@";
   const seedPhone = process.env.SEED_USER_PHONE || "0708657779";

   const passwordHash = await bcrypt.hash(seedPassword, 10);

   const userTableCandidates = ["User", "users"];
   let tableName: string | null = null;

   for (const candidate of userTableCandidates) {
      const existsResult = await prisma.$queryRaw<Array<{ exists: boolean }>>`
         SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = ${candidate}
         ) AS "exists"
      `;

      if (existsResult[0]?.exists) {
         tableName = candidate;
         break;
      }
   }

   if (!tableName) {
      throw new Error("No compatible users table found (expected public.User or public.users)");
   }

   const columns = await prisma.$queryRaw<
      Array<{ column_name: string; is_nullable: "YES" | "NO"; column_default: string | null }>
   >`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
   `;

   const columnNames = new Set(columns.map((c) => c.column_name));

   const passwordColumn = columnNames.has("passwordHash")
      ? "passwordHash"
      : columnNames.has("password")
         ? "password"
         : null;

   if (!columnNames.has("email")) {
      throw new Error(`Column 'email' not found on public.${tableName}`);
   }

   if (!passwordColumn) {
      throw new Error(`No password column found on public.${tableName} (expected passwordHash or password)`);
   }

   const cols: string[] = ["email", passwordColumn];
   const vals: string[] = ["$1", "$2"];
   const updates: string[] = [
      `\"${passwordColumn}\" = EXCLUDED.\"${passwordColumn}\"`,
      "\"email\" = EXCLUDED.\"email\"",
   ];
   const params: unknown[] = [seedEmail, passwordHash];

   const byName = new Map(columns.map((column) => [column.column_name, column]));

   const mustProvide = (name: string) => {
      const column = byName.get(name);
      return Boolean(column && column.is_nullable === "NO" && column.column_default == null);
   };

   if (columnNames.has("id") && mustProvide("id")) {
      cols.push("id");
      vals.push(`$${vals.length + 1}`);
      params.push(randomUUID());
   }

   if (columnNames.has("phone")) {
      cols.push("phone");
      vals.push(`$${vals.length + 1}`);
      params.push(seedPhone);
      updates.push('"phone" = EXCLUDED."phone"');
   }

   if (columnNames.has("role")) {
      cols.push("role");
      vals.push(`$${vals.length + 1}::\"UserRole\"`);
      params.push("WORKER");
      updates.push('"role" = EXCLUDED."role"');
   }

   if (columnNames.has("updatedAt") && mustProvide("updatedAt")) {
      cols.push("updatedAt");
      vals.push(`$${vals.length + 1}`);
      params.push(new Date());
      updates.push('"updatedAt" = EXCLUDED."updatedAt"');
   }

   if (columnNames.has("createdAt") && mustProvide("createdAt")) {
      cols.push("createdAt");
      vals.push(`$${vals.length + 1}`);
      params.push(new Date());
   }

   const sql = `
      INSERT INTO public."${tableName}" (${cols.map((c) => `"${c}"`).join(", ")})
      VALUES (${vals.join(", ")})
      ON CONFLICT ("email") DO UPDATE
      SET ${updates.join(", ")}
   `;

   await prisma.$executeRawUnsafe(sql, ...params);

   console.log(`✅ Seed user ready: ${seedEmail}${columnNames.has("phone") ? ` / ${seedPhone}` : ""}`);
}

main()
   .catch((error) => {
      console.error("❌ Prisma seed error:", error);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function run() {
  if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL");
  const sql = neon(process.env.DATABASE_URL);

  console.log("Creating user_xp table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "user_xp" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "amount" integer NOT NULL,
        "reason" varchar(255) NOT NULL,
        "reference_id" varchar(255) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `;
    console.log("✅ Table user_xp created or already exists.");

    console.log("Creating user_badges table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "user_badges" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "badge_id" uuid NOT NULL,
        "unlocked_at" timestamp NOT NULL DEFAULT now()
      );
    `;
    console.log("✅ Table user_badges created or already exists.");

    console.log("Creating user_xp indices...");
    await sql`
      CREATE INDEX IF NOT EXISTS "user_xp_user_id_idx" ON "user_xp" ("user_id");
    `;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_xp_reference" ON "user_xp" ("user_id", "reference_id");
    `;
    console.log("✅ Indices created successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

run();

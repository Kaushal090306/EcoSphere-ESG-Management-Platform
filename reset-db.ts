import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function reset() {
  if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL");
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    await sql`DROP SCHEMA public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO public`;
    console.log("Schema public dropped and recreated successfully.");
  } catch (err) {
    console.error("Error dropping schema:", err);
  }
}

reset();

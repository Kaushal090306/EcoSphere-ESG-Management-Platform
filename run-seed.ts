import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  try {
    const { seedDatabase } = await import("./src/db/seed");
    await seedDatabase();
    console.log("🌱 Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}
main();

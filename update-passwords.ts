import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import bcrypt from "bcryptjs";

async function main() {
  try {
    const { db } = await import("./src/db");
    const { users } = await import("./src/db/schema/users");
    
    console.log("Generating bcrypt hash for 'password123'...");
    const passwordHash = await bcrypt.hash("password123", 10);
    
    console.log("Updating all user passwords in database...");
    const updated = await db.update(users).set({ passwordHash });
    
    console.log("✅ All user passwords updated successfully to 'password123'!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to update user passwords:", err);
    process.exit(1);
  }
}
main();

import { NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 });
  }

  try {
    await seedDatabase();
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function test() {
  try {
    const { db } = await import("./src/db");
    const { departments, departmentScores } = await import("./src/db/schema");
    const { eq } = await import("drizzle-orm");

    // 1. Get all departments
    const depts = await db.select().from(departments);
    console.log("Departments found:", depts.map(d => d.name));

    // 2. Clear old department scores
    await db.delete(departmentScores);
    console.log("Cleared old scores.");

    // 3. Define rich scores for all departments
    const eng = depts.find(d => d.name === "Engineering")!;
    const ops = depts.find(d => d.name === "Operations")!;
    const mkt = depts.find(d => d.name === "Marketing")!;
    const hr = depts.find(d => d.name === "Human Resources")!;
    const fin = depts.find(d => d.name === "Finance")!;

    const scoreData = [
      // Q1
      { departmentId: eng.id, environmentalScore: "72.4", socialScore: "80.2", governanceScore: "88.0", totalScore: "80.2", period: "2026-Q1" },
      { departmentId: ops.id, environmentalScore: "58.2", socialScore: "68.5", governanceScore: "62.1", totalScore: "62.9", period: "2026-Q1" },
      { departmentId: mkt.id, environmentalScore: "68.0", socialScore: "70.0", governanceScore: "78.4", totalScore: "72.1", period: "2026-Q1" },
      { departmentId: hr.id, environmentalScore: "75.1", socialScore: "89.4", governanceScore: "84.2", totalScore: "82.9", period: "2026-Q1" },
      { departmentId: fin.id, environmentalScore: "69.5", socialScore: "78.0", governanceScore: "87.0", totalScore: "78.2", period: "2026-Q1" },
      // Q2
      { departmentId: eng.id, environmentalScore: "75.5", socialScore: "82.0", governanceScore: "90.0", totalScore: "82.5", period: "2026-Q2" },
      { departmentId: ops.id, environmentalScore: "60.0", socialScore: "70.5", governanceScore: "65.0", totalScore: "65.2", period: "2026-Q2" },
      { departmentId: mkt.id, environmentalScore: "70.2", socialScore: "72.4", governanceScore: "81.5", totalScore: "74.7", period: "2026-Q2" },
      { departmentId: hr.id, environmentalScore: "78.6", socialScore: "91.2", governanceScore: "87.3", totalScore: "85.7", period: "2026-Q2" },
      { departmentId: fin.id, environmentalScore: "71.4", socialScore: "80.0", governanceScore: "89.5", totalScore: "80.3", period: "2026-Q2" },
    ];

    await db.insert(departmentScores).values(scoreData);
    console.log("Seeded detailed department scores successfully!");
  } catch (err) {
    console.error("DB update failed:", err);
  }
}

test();

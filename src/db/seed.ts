import { db } from "@/db";
import {
  users,
  departments,
  categories,
  emissionFactors,
  environmentalGoals,
  productEsgProfiles,
  policies,
  badges,
  rewards,
  esgSettings,
} from "@/db/schema";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // 1. Admin user
  const passwordHash = await bcrypt.hash("password123", 10);
  const [admin] = await db
    .insert(users)
    .values({
      name: "Admin User",
      email: "admin@ecosphere.com",
      passwordHash,
      role: "admin",
      status: "active",
    })
    .onConflictDoNothing()
    .returning();
  console.log("✅ Admin user created");

  // 2. Departments
  const deptData = [
    { name: "Engineering", code: "ENG", employeeCount: 85 },
    { name: "Operations", code: "OPS", employeeCount: 120 },
    { name: "Marketing", code: "MKT", employeeCount: 45 },
    { name: "Human Resources", code: "HR", employeeCount: 30 },
    { name: "Finance", code: "FIN", employeeCount: 40 },
  ];
  const insertedDepts = await db
    .insert(departments)
    .values(deptData.map((d) => ({ ...d, status: "active" as const })))
    .onConflictDoNothing()
    .returning();
  console.log(`✅ ${insertedDepts.length} departments created`);

  // 3. Categories
  const catData = [
    { name: "Community Service", type: "csr_activity" as const },
    { name: "Environmental Cleanup", type: "csr_activity" as const },
    { name: "Education & Mentorship", type: "csr_activity" as const },
    { name: "Energy Saving", type: "challenge" as const },
    { name: "Waste Reduction", type: "challenge" as const },
    { name: "Green Commute", type: "challenge" as const },
  ];
  const insertedCats = await db
    .insert(categories)
    .values(catData.map((c) => ({ ...c, status: "active" as const })))
    .onConflictDoNothing()
    .returning();
  console.log(`✅ ${insertedCats.length} categories created`);

  // 4. Emission Factors
  const efData = [
    { name: "Grid Electricity", sourceType: "electricity" as const, unit: "kWh", factorValue: "0.000233", scope: "scope_2" as const },
    { name: "Natural Gas", sourceType: "fuel" as const, unit: "m³", factorValue: "0.002020", scope: "scope_1" as const },
    { name: "Diesel Fuel", sourceType: "fuel" as const, unit: "liters", factorValue: "0.002680", scope: "scope_1" as const },
    { name: "Petrol (Gasoline)", sourceType: "fleet" as const, unit: "liters", factorValue: "0.002310", scope: "scope_1" as const },
    { name: "Office Paper", sourceType: "materials" as const, unit: "kg", factorValue: "0.000920", scope: "scope_3" as const },
    { name: "Air Travel (Short-haul)", sourceType: "fleet" as const, unit: "km", factorValue: "0.000255", scope: "scope_3" as const },
    { name: "Waste to Landfill", sourceType: "waste" as const, unit: "kg", factorValue: "0.000587", scope: "scope_3" as const },
    { name: "Water Supply", sourceType: "other" as const, unit: "m³", factorValue: "0.000344", scope: "scope_2" as const },
  ];
  const insertedEfs = await db
    .insert(emissionFactors)
    .values(efData.map((e) => ({ ...e, status: "active" as const })))
    .onConflictDoNothing()
    .returning();
  console.log(`✅ ${insertedEfs.length} emission factors created`);

  // 5. Environmental Goals (need department IDs)
  if (insertedDepts.length > 0) {
    const goalData = [
      { title: "Reduce Scope 2 Emissions by 15%", departmentId: insertedDepts[0].id, metric: "CO₂e tonnes", baselineValue: "500.00", targetValue: "425.00", currentValue: "460.00", deadline: "2026-12-31" },
      { title: "Zero Waste to Landfill", departmentId: insertedDepts[1].id, metric: "kg waste", baselineValue: "10000.00", targetValue: "0.00", currentValue: "3200.00", deadline: "2027-06-30" },
      { title: "100% Renewable Energy", departmentId: insertedDepts[0].id, metric: "% renewable", baselineValue: "45.00", targetValue: "100.00", currentValue: "72.00", deadline: "2027-12-31" },
    ];
    await db.insert(environmentalGoals).values(goalData.map((g) => ({ ...g, status: "active" as const }))).onConflictDoNothing();
    console.log("✅ 3 environmental goals created");
  }

  // 6. Product ESG Profiles
  const profileData = [
    { productName: "EcoWidget Pro", carbonIntensity: "2.3400", recyclabilityPercentage: "85.00", certifications: "ISO 14001, FSC Certified" },
    { productName: "GreenPack Packaging", carbonIntensity: "0.8900", recyclabilityPercentage: "95.00", certifications: "Cradle to Cradle, FSC" },
    { productName: "SolarPanel X200", carbonIntensity: "15.6000", recyclabilityPercentage: "72.00", certifications: "IEC 61215, ISO 14001" },
  ];
  await db.insert(productEsgProfiles).values(profileData.map((p) => ({ ...p, status: "active" as const }))).onConflictDoNothing();
  console.log("✅ 3 product ESG profiles created");

  // 7. ESG Policies
  const policyData = [
    { title: "Environmental Policy", version: "2.1", category: "Environmental", content: "This policy outlines our commitment to environmental stewardship, including carbon reduction targets, waste management practices, and sustainable procurement guidelines. All employees are expected to minimize environmental impact in their daily operations.", effectiveDate: "2026-01-01", status: "published" as const },
    { title: "Anti-Bribery & Corruption Policy", version: "1.3", category: "Governance", content: "This policy strictly prohibits all forms of bribery and corruption. Employees must declare any conflicts of interest and report suspicious activities through the designated whistleblower channel.", effectiveDate: "2025-06-15", status: "published" as const },
    { title: "Diversity & Inclusion Policy", version: "1.0", category: "Social", content: "We are committed to fostering a diverse and inclusive workplace. This policy covers equal opportunity hiring, anti-discrimination measures, and accommodation requirements.", effectiveDate: "2026-03-01", status: "published" as const },
    { title: "Whistleblower Protection Policy", version: "1.1", category: "Governance", content: "Employees who report misconduct in good faith are protected from retaliation. This policy details the reporting process and the protections afforded to whistleblowers.", effectiveDate: "2025-09-01", status: "draft" as const },
  ];
  await db.insert(policies).values(policyData).onConflictDoNothing();
  console.log("✅ 4 policies created");

  // 8. Badges
  const badgeData = [
    { name: "Green Starter", description: "Complete your first sustainability challenge", unlockRule: { type: "challenges" as const, threshold: 1 }, icon: "sprout" },
    { name: "Eco Warrior", description: "Complete 10 sustainability challenges", unlockRule: { type: "challenges" as const, threshold: 10 }, icon: "shield" },
    { name: "Carbon Reducer", description: "Earn 500 XP through environmental activities", unlockRule: { type: "xp" as const, threshold: 500 }, icon: "leaf" },
    { name: "Community Champion", description: "Earn 1000 XP through CSR and challenges", unlockRule: { type: "xp" as const, threshold: 1000 }, icon: "heart" },
    { name: "Sustainability Leader", description: "Complete 25 challenges and earn elite status", unlockRule: { type: "challenges" as const, threshold: 25 }, icon: "crown" },
  ];
  await db.insert(badges).values(badgeData.map((b) => ({ ...b, status: "active" as const }))).onConflictDoNothing();
  console.log("✅ 5 badges created");

  // 9. Rewards
  const rewardData = [
    { name: "Extra Day Off", description: "Earn an additional paid day off for outstanding sustainability contributions", pointsRequired: 1000, stock: 10 },
    { name: "Eco-Friendly Gift Box", description: "Curated box of sustainable products including bamboo utensils and organic snacks", pointsRequired: 500, stock: 25 },
    { name: "Plant a Tree", description: "A tree will be planted in your name through our partner reforestation program", pointsRequired: 200, stock: 100 },
    { name: "Coffee Shop Voucher", description: "$25 voucher for the office coffee shop", pointsRequired: 150, stock: 50 },
  ];
  await db.insert(rewards).values(rewardData.map((r) => ({ ...r, status: "active" as const }))).onConflictDoNothing();
  console.log("✅ 4 rewards created");

  // 10. ESG Settings (defaults)
  await db.insert(esgSettings).values({}).onConflictDoNothing();
  console.log("✅ ESG settings initialized");

  console.log("\n🎉 Seed complete! Login with admin@ecosphere.com / password123");
}

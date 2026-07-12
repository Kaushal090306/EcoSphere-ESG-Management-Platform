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
  carbonTransactions,
  csrActivities,
  employeeParticipations,
  diversityMetrics,
  trainingRecords,
  policyAcknowledgements,
  audits,
  complianceIssues,
  challenges,
  challengeParticipations,
  rewardRedemptions,
  challengeParticipations,
  rewardRedemptions,
  departmentScores,
  notifications,
  notificationSettings,
} from "@/db/schema";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // 1. Admin user & regular user
  const passwordHash = await bcrypt.hash("password123", 10);
  const [admin, employee] = await db
    .insert(users)
    .values([
      {
        name: "Admin User",
        email: "admin@ecosphere.com",
        passwordHash,
        role: "admin",
        status: "active",
        points: 500,
        xp: 1500,
      },
      {
        name: "Jane Doe",
        email: "jane.doe@ecosphere.com",
        passwordHash,
        role: "employee",
        status: "active",
        points: 1200,
        xp: 3400,
      }
    ])
    .onConflictDoNothing()
    .returning();
  console.log("✅ Users created");

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

  // Update employee department
  if (insertedDepts.length > 0 && employee) {
    await db.update(users).set({ departmentId: insertedDepts[0].id }).where({ id: employee.id });
  }

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
  ];
  const insertedEfs = await db
    .insert(emissionFactors)
    .values(efData.map((e) => ({ ...e, status: "active" as const })))
    .onConflictDoNothing()
    .returning();
  console.log(`✅ ${insertedEfs.length} emission factors created`);

  // 5. Environmental Goals
  if (insertedDepts.length > 0) {
    const goalData = [
      { title: "Reduce Scope 2 Emissions by 15%", departmentId: insertedDepts[0].id, metric: "CO₂e tonnes", baselineValue: "500.00", targetValue: "425.00", currentValue: "460.00", deadline: new Date("2026-12-31") },
      { title: "Zero Waste to Landfill", departmentId: insertedDepts[1].id, metric: "kg waste", baselineValue: "10000.00", targetValue: "0.00", currentValue: "3200.00", deadline: new Date("2027-06-30") },
      { title: "100% Renewable Energy", departmentId: insertedDepts[0].id, metric: "% renewable", baselineValue: "45.00", targetValue: "100.00", currentValue: "72.00", deadline: new Date("2027-12-31") },
    ];
    await db.insert(environmentalGoals).values(goalData.map((g) => ({ ...g, status: "active" as const }))).onConflictDoNothing();
    console.log("✅ 3 environmental goals created");
  }

  // 6. Product ESG Profiles
  const profileData = [
    { productName: "EcoWidget Pro", carbonIntensity: "2.3400", recyclability: "High", certifications: ["ISO 14001", "FSC Certified"] },
    { productName: "GreenPack Packaging", carbonIntensity: "0.8900", recyclability: "Very High", certifications: ["Cradle to Cradle", "FSC"] },
  ];
  await db.insert(productEsgProfiles).values(profileData.map((p) => ({ ...p, status: "active" as const }))).onConflictDoNothing();

  // 7. ESG Policies
  const policyData = [
    { title: "Environmental Policy", version: "2.1", category: "Environmental", content: "This policy outlines our commitment to environmental stewardship...", effectiveDate: new Date("2026-01-01"), status: "published" as const },
    { title: "Anti-Bribery & Corruption Policy", version: "1.3", category: "Governance", content: "This policy strictly prohibits all forms of bribery...", effectiveDate: new Date("2025-06-15"), status: "published" as const },
    { title: "Whistleblower Protection Policy", version: "1.1", category: "Governance", content: "Employees who report misconduct...", effectiveDate: new Date("2025-09-01"), status: "draft" as const },
  ];
  const insertedPolicies = await db.insert(policies).values(policyData).onConflictDoNothing().returning();

  // 8. Badges & Rewards
  const badgeData = [
    { name: "Green Starter", description: "Complete your first sustainability challenge", unlockRule: { type: "challenges", threshold: 1 }, icon: "sprout" },
    { name: "Eco Warrior", description: "Complete 10 sustainability challenges", unlockRule: { type: "challenges", threshold: 10 }, icon: "shield" },
  ];
  await db.insert(badges).values(badgeData.map((b) => ({ ...b, status: "active" as const }))).onConflictDoNothing();

  const rewardData = [
    { name: "Extra Day Off", description: "Earn an additional paid day off for outstanding sustainability contributions", pointsRequired: 1000, stock: 10 },
    { name: "Eco-Friendly Gift Box", description: "Curated box of sustainable products", pointsRequired: 500, stock: 25 },
  ];
  const insertedRewards = await db.insert(rewards).values(rewardData.map((r) => ({ ...r, status: "active" as const }))).onConflictDoNothing().returning();

  // 9. ESG Settings
  await db.insert(esgSettings).values({}).onConflictDoNothing();

  const notificationSettingsData = [
    { eventType: "compliance_issue" as const, inAppEnabled: true, emailEnabled: true },
    { eventType: "csr_approval" as const, inAppEnabled: true, emailEnabled: false },
    { eventType: "challenge_approval" as const, inAppEnabled: true, emailEnabled: false },
    { eventType: "policy_reminder" as const, inAppEnabled: true, emailEnabled: true },
    { eventType: "badge_unlock" as const, inAppEnabled: true, emailEnabled: false },
    { eventType: "overdue_issue" as const, inAppEnabled: true, emailEnabled: true },
  ];
  await db.insert(notificationSettings).values(notificationSettingsData).onConflictDoNothing();

  // --- NEW TABLES SEEDING ---

  // Carbon Transactions
  if (insertedDepts.length > 0 && insertedEfs.length > 0) {
    const transactions = [];
    for (let i = 0; i < insertedDepts.length; i++) {
      transactions.push({
        departmentId: insertedDepts[i].id,
        sourceType: "expense" as const,
        emissionFactorId: insertedEfs[0].id, // Grid Electricity
        quantity: "1500",
        co2eValue: (1500 * parseFloat(insertedEfs[0].factorValue)).toFixed(2),
        date: new Date(),
        autoCalculated: true,
      });
      transactions.push({
        departmentId: insertedDepts[i].id,
        sourceType: "purchase" as const,
        emissionFactorId: insertedEfs[4].id, // Office Paper
        quantity: "50",
        co2eValue: (50 * parseFloat(insertedEfs[4].factorValue)).toFixed(2),
        date: new Date(Date.now() - 86400000 * 5),
        autoCalculated: false,
      });
    }
    await db.insert(carbonTransactions).values(transactions).onConflictDoNothing();
    console.log("✅ Carbon transactions created");
  }

  // CSR Activities & Participations
  if (insertedCats.length > 0 && admin && employee) {
    const activitiesData = [
      { title: "Beach Cleanup 2026", categoryId: insertedCats[1].id, description: "Annual beach cleanup drive.", date: new Date(Date.now() - 86400000 * 10), maxParticipants: 50, status: "closed" as const },
      { title: "Tree Planting Initiative", categoryId: insertedCats[0].id, description: "Planting trees in the local park.", date: new Date(Date.now() + 86400000 * 20), maxParticipants: 30, status: "open" as const },
      { title: "Local School Mentorship", categoryId: insertedCats[2].id, description: "Mentoring high school students.", date: new Date(), maxParticipants: 10, status: "draft" as const },
    ];
    const insertedActivities = await db.insert(csrActivities).values(activitiesData).onConflictDoNothing().returning();

    if (insertedActivities.length > 0) {
      await db.insert(employeeParticipations).values([
        { employeeId: admin.id, activityId: insertedActivities[0].id, approvalStatus: "approved" as const, pointsEarned: 100 },
        { employeeId: employee.id, activityId: insertedActivities[0].id, approvalStatus: "approved" as const, pointsEarned: 100 },
        { employeeId: employee.id, activityId: insertedActivities[1].id, approvalStatus: "pending" as const },
      ]).onConflictDoNothing();
    }
    console.log("✅ CSR Activities & Participations created");
  }

  // Audits & Compliance Issues
  if (insertedDepts.length > 0 && admin && employee) {
    const auditData = [
      { title: "Q3 Environmental Compliance Audit", departmentId: insertedDepts[1].id, auditorId: admin.id, scheduledDate: new Date(Date.now() - 86400000 * 30), status: "completed" as const },
      { title: "Annual Safety Audit", departmentId: insertedDepts[0].id, auditorId: admin.id, scheduledDate: new Date(), status: "in_progress" as const },
    ];
    const insertedAudits = await db.insert(audits).values(auditData).onConflictDoNothing().returning();

    if (insertedAudits.length > 0) {
      await db.insert(complianceIssues).values([
        { auditId: insertedAudits[0].id, severity: "high" as const, description: "Improper disposal of hazardous materials.", ownerId: employee.id, dueDate: new Date(Date.now() - 86400000 * 5), status: "open" as const, overdueFlag: true }, // Overdue
        { auditId: insertedAudits[1].id, severity: "low" as const, description: "Fire extinguisher missing tag.", ownerId: admin.id, dueDate: new Date(Date.now() + 86400000 * 15), status: "in_progress" as const },
      ]).onConflictDoNothing();
    }
    console.log("✅ Audits & Compliance issues created");
  }

  // Challenges & Participations
  if (insertedCats.length > 0 && admin && employee) {
    const challData = [
      { title: "Bike to Work Week", categoryId: insertedCats[5].id, xp: 200, difficulty: "medium" as const, deadline: new Date(Date.now() + 86400000 * 7), status: "active" as const },
      { title: "Zero Waste Challenge", categoryId: insertedCats[4].id, xp: 300, difficulty: "hard" as const, deadline: new Date(Date.now() - 86400000 * 2), status: "completed" as const },
      { title: "Turn Off Lights", categoryId: insertedCats[3].id, xp: 50, difficulty: "easy" as const, status: "draft" as const },
      { title: "Paperless Month", categoryId: insertedCats[4].id, xp: 150, difficulty: "medium" as const, deadline: new Date(Date.now() + 86400000 * 14), status: "active" as const },
    ];
    const insertedChallenges = await db.insert(challenges).values(challData).onConflictDoNothing().returning();

    if (insertedChallenges.length > 0) {
      await db.insert(challengeParticipations).values([
        { challengeId: insertedChallenges[0].id, employeeId: admin.id, progressPct: 50, approvalStatus: "approved" as const },
        { challengeId: insertedChallenges[1].id, employeeId: employee.id, progressPct: 100, approvalStatus: "approved" as const, xpAwarded: 300 },
      ]).onConflictDoNothing();
    }
    console.log("✅ Challenges & Participations created");
  }

  // Reward Redemptions
  if (employee && insertedRewards.length > 0) {
    await db.insert(rewardRedemptions).values([
      { employeeId: employee.id, rewardId: insertedRewards[1].id, pointsSpent: 500, redeemedAt: new Date() },
    ]).onConflictDoNothing();
  }

  // Department Scores
  if (insertedDepts.length > 0) {
    const scoreData = [];
    for (let i = 0; i < 2; i++) { // for 2 periods
      const period = `2026-Q${i+1}`;
      scoreData.push({ departmentId: insertedDepts[0].id, environmentalScore: "75.5", socialScore: "82.0", governanceScore: "90.0", totalScore: "82.5", period });
      scoreData.push({ departmentId: insertedDepts[1].id, environmentalScore: "60.0", socialScore: "70.5", governanceScore: "65.0", totalScore: "65.2", period });
    }
    await db.insert(departmentScores).values(scoreData).onConflictDoNothing();
  }

  // Diversity & Training Records
  if (insertedDepts.length > 0 && admin && employee) {
    await db.insert(diversityMetrics).values([
      { departmentId: insertedDepts[0].id, genderBreakdown: { male: 50, female: 35 }, period: "2026-Q2" },
      { departmentId: insertedDepts[1].id, genderBreakdown: { male: 70, female: 50 }, period: "2026-Q2" },
    ]).onConflictDoNothing();

    await db.insert(trainingRecords).values([
      { employeeId: employee.id, courseName: "Anti-Bribery Basics", status: "completed" as const, completedAt: new Date() },
      { employeeId: admin.id, courseName: "ESG Advanced Metrics", status: "in_progress" as const },
    ]).onConflictDoNothing();
  }

  // Policy Acknowledgements & Notifications
  if (insertedPolicies.length > 0 && employee) {
    await db.insert(policyAcknowledgements).values([
      { employeeId: employee.id, policyId: insertedPolicies[0].id, ipAddress: "192.168.1.1" },
    ]).onConflictDoNothing();

    await db.insert(notifications).values([
      { userId: employee.id, type: "policy_reminder" as const, message: "Please acknowledge the new Environmental Policy." },
      { userId: employee.id, type: "badge_unlock" as const, message: "You earned the Eco Warrior badge!", read: true },
    ]).onConflictDoNothing();
  }

  console.log("\n🎉 Seed complete! Login with admin@ecosphere.com / password123");
}

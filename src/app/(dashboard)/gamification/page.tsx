import { getSessionUser } from "@/lib/auth-utils";
import { db } from "@/db";
import { users, challenges, userBadges, userXpTransactions } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { getOwnUnlockedBadges } from "@/actions/gamification";
import { OverviewClient } from "./overview-client";
import { redirect } from "next/navigation";

export default async function GamificationOverviewPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    redirect("/login");
  }

  // 1. Fetch user data from DB
  const [dbUser] = await db
    .select({
      name: users.name,
      xp: users.xp,
      points: users.points,
    })
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  if (!dbUser) {
    redirect("/login");
  }

  // Calculate Level = floor(XP / 100) + 1
  const level = Math.floor(dbUser.xp / 100) + 1;
  const progressInLevel = dbUser.xp % 100;
  const percentProgress = Math.min(100, Math.max(0, progressInLevel));

  // 2. Fetch stats
  const [activeChallenges] = await db
    .select({ count: sql<number>`count(${challenges.id})::int` })
    .from(challenges)
    .where(eq(challenges.status, "active"));

  const [totalBadgesCount] = await db
    .select({ count: sql<number>`count(${userBadges.id})::int` })
    .from(userBadges)
    .where(eq(userBadges.userId, sessionUser.id));

  const [totalXpDistributed] = await db
    .select({ sum: sql<number>`COALESCE(sum(${userXpTransactions.amount}), 0)::int` })
    .from(userXpTransactions);

  // Compute Rank
  const rankList = await db
    .select({ id: users.id })
    .from(users)
    .orderBy(desc(users.xp));
  const userRank = rankList.findIndex((u) => u.id === sessionUser.id) + 1;

  // 3. Fetch user's latest 5 XP transactions
  const recentTransactions = await db
    .select()
    .from(userXpTransactions)
    .where(eq(userXpTransactions.userId, sessionUser.id))
    .orderBy(desc(userXpTransactions.createdAt))
    .limit(5);

  // 4. Fetch user's own unlocked badges
  const unlockedBadges = await getOwnUnlockedBadges();

  // Chart data
  const chartData = [
    { name: "Green Champion", completedCount: 45 },
    { name: "Office Energy Saver", completedCount: 30 },
    { name: "Commute Master", completedCount: 22 },
    { name: "Zero Waste Hero", completedCount: 15 },
  ];

  return (
    <OverviewClient
      user={{
        name: dbUser.name,
        xp: dbUser.xp,
        points: dbUser.points,
        level,
        percentProgress,
      }}
      stats={{
        activeChallengesCount: activeChallenges?.count || 0,
        totalBadgesCount: totalBadgesCount?.count || 0,
        totalXpDistributed: totalXpDistributed?.sum || 0,
        userRank,
      }}
      recentTransactions={recentTransactions}
      unlockedBadges={unlockedBadges}
      chartData={chartData}
    />
  );
}

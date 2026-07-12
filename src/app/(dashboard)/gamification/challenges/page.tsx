import { getChallenges } from "@/actions/challenges";
import { getCategories } from "@/actions/categories";
import { getChallengeParticipations } from "@/actions/gamification";
import { getSessionUser } from "@/lib/auth-utils";
import { ChallengesClient } from "./challenges-client";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ChallengesPage() {
  const sessionUser = await getSessionUser();

  let userRole = "employee";
  if (sessionUser?.id) {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);
    if (user) {
      userRole = user.role;
    }
  }

  const [challenges, categories, participations] = await Promise.all([
    getChallenges(),
    getCategories(),
    getChallengeParticipations(),
  ]);

  return (
    <ChallengesClient
      challenges={challenges}
      participations={participations}
      categories={categories}
      userRole={userRole}
    />
  );
}

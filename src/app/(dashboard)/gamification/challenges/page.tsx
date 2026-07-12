import { getChallenges } from "@/actions/challenges";
import { getCategories } from "@/actions/categories";
import { getChallengeParticipations } from "@/actions/gamification";
import { getSessionUser } from "@/lib/auth-utils";
import { ChallengesClient } from "./challenges-client";
import { Swords } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
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
    <div className="space-y-6">
      <PageHeader
        title="Sustainability Challenges"
        description="Participate in active team quests, submit evidence of completion, and earn ESG points"
        icon={Swords}
      />
      <ChallengesClient
        challenges={challenges}
        participations={participations}
        categories={categories}
        userRole={userRole}
      />
    </div>
  );
}

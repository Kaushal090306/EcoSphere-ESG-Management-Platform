import { getRewards } from "@/actions/rewards";
import { RewardsClient } from "./rewards-client";
import { Gift } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { getSessionUser } from "@/lib/auth-utils";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function RewardsPage() {
  const [rewardList, sessionUser] = await Promise.all([
    getRewards(),
    getSessionUser(),
  ]);

  let dbUser = null;
  if (sessionUser?.id) {
    const [found] = await db
      .select({ points: users.points, role: users.role })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);
    dbUser = found;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Rewards Catalog" description="Redeem your earned sustainability points for real incentives" icon={Gift} />
      <RewardsClient
        rewards={rewardList}
        userPoints={dbUser?.points || 0}
        userRole={dbUser?.role || "employee"}
      />
    </div>
  );
}

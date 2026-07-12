import { getRewards } from "@/actions/rewards";
import { RewardsClient } from "./rewards-client";
import { Gift } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function RewardsPage() {
  const rewardList = await getRewards();
  return (
    <div className="space-y-6">
      <PageHeader title="Rewards" description="Manage redeemable incentives for employees" icon={Gift} />
      <RewardsClient rewards={rewardList} />
    </div>
  );
}

import { getBadges } from "@/actions/badges";
import { BadgesClient } from "./badges-client";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function BadgesPage() {
  const badgeList = await getBadges();
  return (
    <div className="space-y-6">
      <PageHeader title="Badges" description="Define employee achievement badges and unlock rules" icon={Award} />
      <BadgesClient badges={badgeList} />
    </div>
  );
}

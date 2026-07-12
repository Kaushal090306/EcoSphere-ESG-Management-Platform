import { getBadges } from "@/actions/badges";
import { BadgesClient } from "./badges-client";

export default async function BadgesPage() {
  const badgeList = await getBadges();
  return (
    <BadgesClient badges={badgeList} />
  );
}

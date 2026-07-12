import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { getUserNotifications } from "@/actions/notifications";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const list = await getUserNotifications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with compliance status, challenges, badge unlocks, and policy reminders"
        icon={Bell}
      />
      <NotificationsClient initialNotifications={list} />
    </div>
  );
}

import { getEsgSettings } from "@/actions/esg-settings";
import { SettingsClient } from "./settings-client";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "admin") {
    redirect("/settings/profile");
  }

  const settings = await getEsgSettings();
  return (
    <div className="space-y-6">
      <PageHeader title="ESG Configuration" description="Configure scoring weights and system toggles" icon={SlidersHorizontal} />
      <SettingsClient settings={settings} />
    </div>
  );
}

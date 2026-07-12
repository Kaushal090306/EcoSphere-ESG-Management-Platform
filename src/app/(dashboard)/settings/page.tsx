import { getEsgSettings } from "@/actions/esg-settings";
import { SettingsClient } from "./settings-client";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function SettingsPage() {
  const settings = await getEsgSettings();
  return (
    <div className="space-y-6">
      <PageHeader title="ESG Configuration" description="Configure scoring weights and system toggles" icon={SlidersHorizontal} />
      <SettingsClient settings={settings} />
    </div>
  );
}

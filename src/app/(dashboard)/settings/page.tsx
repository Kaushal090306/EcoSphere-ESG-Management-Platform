import { getEsgSettings } from "@/actions/esg-settings";
import { SettingsClient } from "./settings-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "admin") {
    redirect("/settings/profile");
  }

  const settings = await getEsgSettings();
  return <SettingsClient settings={settings} />;
}

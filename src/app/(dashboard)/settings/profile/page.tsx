import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentUserProfile } from "@/actions/users";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userProfile = await getCurrentUserProfile();

  return (
    <div className="space-y-6">
      <ProfileClient initialUser={userProfile} />
    </div>
  );
}

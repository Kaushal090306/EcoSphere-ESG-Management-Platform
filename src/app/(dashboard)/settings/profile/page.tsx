import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/actions/users";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userProfile = await getCurrentUserProfile();

  return <ProfileClient initialUser={userProfile} />;
}

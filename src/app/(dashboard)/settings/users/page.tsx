import { getUsers } from "@/actions/users";
import { getDepartments } from "@/actions/departments";
import { UsersClient } from "./users-client";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function UsersPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "admin") {
    return <AccessDenied />;
  }

  const [usersList, departments] = await Promise.all([
    getUsers(),
    getDepartments(),
  ]);

  return (
    <div className="space-y-6">
      <UsersClient initialUsers={usersList} departments={departments} />
    </div>
  );
}

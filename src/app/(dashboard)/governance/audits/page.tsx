import { getAudits } from "@/actions/governance-items";
import { getDepartments } from "@/actions/departments";
import { AuditsClient } from "./audits-client";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function AuditsPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor"];
  const user = session?.user as any;

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  const [audits, departments] = await Promise.all([
    getAudits(),
    getDepartments(),
  ]);

  return (
    <div className="space-y-4">
      <AuditsClient audits={audits} departments={departments} />
    </div>
  );
}

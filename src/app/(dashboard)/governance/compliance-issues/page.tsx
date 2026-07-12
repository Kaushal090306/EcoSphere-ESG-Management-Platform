import { getComplianceIssues, getAudits } from "@/actions/governance-items";
import { ComplianceClient } from "./compliance-client";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function ComplianceIssuesPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor", "employee"];
  const user = session?.user as any;

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  const [issues, audits] = await Promise.all([
    getComplianceIssues(),
    getAudits(),
  ]);

  return (
    <div className="space-y-4">
      <ComplianceClient issues={issues} audits={audits} />
    </div>
  );
}

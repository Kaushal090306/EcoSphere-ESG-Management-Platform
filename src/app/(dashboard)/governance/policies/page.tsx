import { getPolicies, getPolicyAcknowledgements } from "@/actions/policies";
import { PoliciesClient } from "./policies-client";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function PoliciesPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor", "employee"];
  const user = session?.user as any;

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  const [pols, acks] = await Promise.all([
    getPolicies(),
    getPolicyAcknowledgements(),
  ]);
  return (
    <div className="space-y-4">
      <PoliciesClient policies={pols} initialAcknowledgements={acks} userRole={user.role} />
    </div>
  );
}

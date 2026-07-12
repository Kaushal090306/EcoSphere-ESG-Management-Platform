import { getEmissionFactors } from "@/actions/emission-factors";
import { EmissionFactorsClient } from "./emission-factors-client";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function EmissionFactorsPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor"];
  const user = session?.user as any;

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  const factors = await getEmissionFactors();

  return (
    <div className="space-y-4">
      <EmissionFactorsClient factors={factors} userRole={user.role} />
    </div>
  );
}

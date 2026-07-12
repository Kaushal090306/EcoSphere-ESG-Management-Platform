import { getPolicies, getPolicyAcknowledgements } from "@/actions/policies";
import { PoliciesClient } from "./policies-client";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function PoliciesPage() {
  const [pols, acks] = await Promise.all([
    getPolicies(),
    getPolicyAcknowledgements(),
  ]);
  return (
    <div className="space-y-6">
      <PageHeader title="ESG Policies" description="Create, version, and publish governance policies" icon={FileText} />
      <PoliciesClient policies={pols} initialAcknowledgements={acks} />
    </div>
  );
}

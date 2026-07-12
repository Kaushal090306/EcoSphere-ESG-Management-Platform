import { getEmissionFactors } from "@/actions/emission-factors";
import { EmissionFactorsClient } from "./emission-factors-client";
import { Gauge } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function EmissionFactorsPage() {
  const factors = await getEmissionFactors();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emission Factors"
        description="Configure CO₂e conversion values for carbon calculations"
        icon={Gauge}
      />
      <EmissionFactorsClient factors={factors} />
    </div>
  );
}

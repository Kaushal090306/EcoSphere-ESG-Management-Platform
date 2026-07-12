import { getEmissionFactors } from "@/actions/emission-factors";
import { EmissionFactorsClient } from "./emission-factors-client";

export default async function EmissionFactorsPage() {
  const factors = await getEmissionFactors();

  return (
    <div className="space-y-4">
      <EmissionFactorsClient factors={factors} />
    </div>
  );
}

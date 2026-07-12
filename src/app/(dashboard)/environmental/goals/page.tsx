import { getEnvironmentalGoals } from "@/actions/environmental-goals";
import { getDepartments } from "@/actions/departments";
import { GoalsClient } from "./goals-client";
import { Target } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function GoalsPage() {
  const [goals, departments] = await Promise.all([getEnvironmentalGoals(), getDepartments()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Environmental Goals" description="Set and track sustainability reduction targets" icon={Target} />
      <GoalsClient goals={goals} departments={departments} />
    </div>
  );
}

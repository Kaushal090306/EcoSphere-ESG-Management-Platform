import { getEnvironmentalGoals } from "@/actions/environmental-goals";
import { getDepartments } from "@/actions/departments";
import { GoalsClient } from "./goals-client";

export default async function GoalsPage() {
  const [goals, departments] = await Promise.all([getEnvironmentalGoals(), getDepartments()]);

  return (
    <div className="space-y-4">
      <GoalsClient goals={goals} departments={departments} />
    </div>
  );
}

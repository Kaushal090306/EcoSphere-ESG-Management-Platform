import { getDiversityMetrics } from "@/actions/diversity";
import { getDepartments } from "@/actions/departments";
import { auth } from "@/auth";
import { DiversityClient } from "./diversity-client";

export default async function DiversityPage() {
  const [metrics, departments, session] = await Promise.all([
    getDiversityMetrics(),
    getDepartments(),
    auth(),
  ]);

  return (
    <div className="space-y-6">

      <DiversityClient 
        metrics={metrics} 
        departments={departments}
        userRole={(session?.user as any)?.role || "employee"}
      />
    </div>
  );
}

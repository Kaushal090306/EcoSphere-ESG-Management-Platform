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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Diversity Metrics</h1>
        <p className="text-muted-foreground">
          Monitor and manage workforce diversity records.
        </p>
      </div>

      <DiversityClient 
        metrics={metrics} 
        departments={departments}
        userRole={(session?.user as any)?.role || "employee"}
      />
    </div>
  );
}

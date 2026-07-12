import { getCsrActivities } from "@/actions/csr-activities";
import { getDepartments } from "@/actions/departments";
import { getCategories } from "@/actions/categories";
import { CsrActivitiesClient } from "./csr-activities-client";
import { auth } from "@/auth";

export default async function CsrActivitiesPage() {
  const [activities, departments, categories, session] = await Promise.all([
    getCsrActivities(),
    getDepartments(),
    getCategories(),
    auth(),
  ]);

  return (
    <div className="space-y-6">

      <CsrActivitiesClient
        activities={activities}
        departments={departments}
        categories={categories}
        userRole={(session?.user as any)?.role}
      />
    </div>
  );
}

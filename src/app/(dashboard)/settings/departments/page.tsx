import { getDepartments } from "@/actions/departments";
import { DepartmentsClient } from "./departments-client";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage organizational departments and ESG ownership"
        icon={Building2}
      />
      <DepartmentsClient departments={departments} />
    </div>
  );
}

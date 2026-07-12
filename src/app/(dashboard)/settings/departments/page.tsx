import { getDepartments } from "@/actions/departments";
import { DepartmentsClient } from "./departments-client";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function DepartmentsPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "admin") {
    return <AccessDenied />;
  }

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

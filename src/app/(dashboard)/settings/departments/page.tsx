import { getDepartments } from "@/actions/departments";
import { DepartmentsClient } from "./departments-client";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function DepartmentsPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "admin") {
    return <AccessDenied />;
  }

  const departments = await getDepartments();

  return <DepartmentsClient departments={departments} />;
}

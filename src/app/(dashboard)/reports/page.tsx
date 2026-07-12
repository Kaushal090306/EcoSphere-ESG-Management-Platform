import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";
import { getReportFilterOptions } from "@/actions/reports";
import { ReportsClient } from "./reports-client";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export default async function ReportsPage() {
  const session = await auth();
  const allowedRoles = ["admin", "esg_manager", "auditor", "dept_head", "employee"];

  const sessionUser = session?.user as any;

  if (!sessionUser?.id || !sessionUser.role || !allowedRoles.includes(sessionUser.role)) {
    return <AccessDenied />;
  }

  // Query fresh user details from database to avoid stale session cache
  const [dbUser] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      departmentId: users.departmentId
    })
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  const currentUser = dbUser || {
    id: sessionUser.id,
    name: sessionUser.name || "User",
    email: sessionUser.email || "",
    role: sessionUser.role,
    departmentId: null
  };

  const filterOptions = await getReportFilterOptions();

  return (
    <ReportsClient 
      user={currentUser as any} 
      options={filterOptions as any} 
    />
  );
}
